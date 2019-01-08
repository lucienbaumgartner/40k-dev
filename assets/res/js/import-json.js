var rankingOverall;
var gamesPlayed;
var factionRankings;
/*
$.getJSON("assets/origin.json", function(data){
  myBooks = data;
  console.log(myBooks);
});
*/

$.getJSON("../40k-dev/assets/res/origins/ranking.json", function(data){
  rankingOverall = data;
  console.log(rankingOverall);
});
$.getJSON("../40k-dev/assets/res/origins/games-played.json", function(data){
  gamesPlayed = data;
  console.log(gamesPlayed);
});
$.getJSON("../40k-dev/assets/res/origins/faction-scores.json", function(data){
  factionRankings = data;
  console.log(factionRankings);
});

function CreateTableFromJSON(source) {
    if ("factionRankings" === String(source)) {
      var message = document.createElement("p");
      message.innerHTML = "Service not available, yet."
      var divContainer = document.getElementById("notAvailable");
      divContainer.innerHTML = "";
      divContainer.appendChild(message);
    } else {
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

      var tr = table.insertRow(-1);                   // TABLE ROW.

      for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
      }

      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (var i = 0; i < source.length; i++) {

          tr = table.insertRow(-1);

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
}
