library(dplyr)
library(lubridate)
library(reshape2)
library(readr)
library(jsonlite)

setwd('~/40k-dev/assets/res/')
df <- 
  read.csv('results.csv', stringsAsFactors = F) %>% 
  setNames(., gsub('\\.\\..*', '', tolower(names(.)))) %>% 
  filter(!is.na(player1)&!is.na(score.p1)) %>% 
  mutate(date=dmy(date)) %>% 
  mutate_at(.vars=vars(player1, player1, main.faction.p1, main.faction.p2, mission, mission.format), 
            .funs=trimws) %>% 
  mutate(
    points.p1=case_when(
      score.p1==score.p2 ~ 0.5,
      score.p1>score.p2 ~ 1,
      score.p1<score.p2 ~ 0
    ),
    points.p2=1-points.p1,
    res.p1=case_when(
      points.p1==1 ~ 'win',
      points.p1==0.5 ~ 'tie',
      points.p1==0 ~ 'loss'
    ),
    res.p2=case_when(
      points.p2==1 ~ 'win',
      points.p2==0.5 ~ 'tie',
      points.p2==0 ~ 'loss'
    ),
    id = row_number()
    ) %>% 
  as_tibble 
df

ranking <- 
  df %>% 
  group_by(player1) %>% 
  summarise(points=sum(points.p1)) %>% 
  ungroup %>% 
  rename(player=player1) %>% 
  bind_rows(
    df %>% 
      group_by(player2) %>% 
      summarise(points=sum(points.p2)) %>% 
      ungroup %>% 
      rename(player=player2)
  ) %>% 
  group_by(player) %>% 
  summarise(points=sum(points))

score_comp <- 
  tibble(player=c(df$player1, df$player2), 
         score=c(df$res.p1, df$res.p2)) %>% 
  group_by(player, score) %>% 
  summarise(n=n()) %>% 
  dcast(., formula = player ~ score, value.var='n') %>% 
  mutate_at(.vars=vars(loss, tie, win), 
            .funs=function(x){
              ifelse(is.na(x), 0, x)
            }) %>% 
  rowwise() %>% 
  mutate(n.games=sum(loss, tie, win))

main_army <- 
  tibble(player=c(df$player1, df$player2), 
         faction=c(df$main.faction.p1, df$main.faction.p2)) %>% 
  group_by(player, faction) %>% 
  summarise(n=n()) %>% 
  ungroup %>% 
  group_by(player) %>% 
  filter(n==max(n)&!duplicated(player)) %>% 
  select(-n)

dfx <- 
  left_join(ranking, score_comp) %>% 
  left_join(., main_army) %>% 
  arrange(desc(points), player) %>% 
  mutate(rank=row_number(),
         category="") %>% 
  select(rank, player, category, points, n.games,  win, loss, tie, faction) %>% 
  setNames(., c('Place', 'Name',	'Category', 'Score',	'Games',	'Wins',	'Losses', 'Tie', 'Main army'))

toJSON(dfx, raw = 'mongo') %>% write_lines(., path='origins/ranking_2.json')


