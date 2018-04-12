// Global JSON array
var dataArray = [];
// Setup DataTable and sort by Rank
var table = $("#details").DataTable({
    "order": [
        [0, "asc"]
    ]
});

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/population-by-country.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function(response) {
    dataArray = JSON.parse(response);
    for (var i = 0; i < dataArray.length; i++) {
        table.row.add([dataArray[i].Rank,
            dataArray[i].country,
            dataArray[i].population
        ]).draw(true);
    }
})
