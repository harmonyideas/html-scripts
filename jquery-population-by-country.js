// Global JSON array
var dataArray = [];

// Create a DataTable element
var table = $("#details").DataTable({
  order: [[0, "asc"]],
});

// Load the JSON data
function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "data/population-by-country.json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.send();
}

// Populate the DataTable with the JSON data
function populateTable(data) {
  table.clear();
  for (var i = 0; i < data.length; i++) {
    table.row.add([data[i].Rank, data[i].country, data[i].population]).draw(true);
  }
}

// Load the JSON data and populate the table
loadJSON(function (response) {
  dataArray = JSON.parse(response);
  populateTable(dataArray);
});
