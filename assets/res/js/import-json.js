var rankingOverall;
var gamesPlayed;
var factionRankings;
/*
$.getJSON("assets/origin.json", function(data){
  myBooks = data;
  console.log(myBooks);
});
*/
var base_url = window.location.href

if (base_url.includes('localhost')) {
  var rel_url = ''
} else {
  var rel_url = '../40k-dev'
}

$.getJSON(rel_url.concat("/assets/res/origins/ranking_2.json"), function(data){
  rankingOverall = data;
  console.log(rankingOverall);
});
$.getJSON(rel_url.concat("/assets/res/origins/games-played.json"), function(data){
  gamesPlayed = data;
  console.log(gamesPlayed);
});
$.getJSON(rel_url.concat("/assets/res/origins/faction-scores.json"), function(data){
  factionRankings = data;
  console.log(factionRankings);
});

function CreateTableFromJSON(source) {
      setTimeout("document.getElementById('showData').focus();",100);

      var col = [];
      for (var i = 0; i < source.length; i++) {
          for (var key in source[i]) {
              if (col.indexOf(key) === -1) {
                  col.push(key);
              }
          }
      }

      // CREATE DYNAMIC TABLE.
      var table = document.createElement("table");

      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
      var thead = document.createElement("thead")
      var tbody = document.createElement("tbody")
      table.appendChild(thead)
      table.appendChild(tbody)

      var tr = thead.insertRow(-1);                   // TABLE ROW.

      for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
      }

      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (var i = 0; i < source.length; i++) {

          tr = tbody.insertRow(-1);

          for (var j = 0; j < col.length; j++) {
              var tabCell = tr.insertCell(-1);
              tabCell.innerHTML = source[i][col[j]];
          }
      }

      // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
      var divContainer = document.getElementById("showData");
      divContainer.innerHTML = "";
      divContainer.appendChild(table);
}

function ServiceNotAvailable() {
  var message = document.createElement("p");
  message.innerHTML = "Service not available, yet."
  message.classList.add("not-available");
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(message);
}
