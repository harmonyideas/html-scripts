// Global JSON array
var dataArray = [];
var table = $("#details").DataTable();

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/congress-legislators.json', true);
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
    var statesArray = [];
    var filterArray = [];

    // Create array to hold both abbreviated and full state names
    $.each(dataArray[0].states, function(i, item) {
        var states = [
            [i],
            [item]
        ];
        statesArray.push(states);
    });

    // Sorting the states 
    statesArray.sort();
    var $stateDropDown = $("#DropDown_State");

    // Build the list of US states for user to select
    $.each(statesArray, function(i, item) {
        $stateDropDown.append('<option value="' + item[0] + '">' + item[1] + '</option>');
    });

    $stateDropDown.change(function() {
        var selectedstate = this.value;
        //filter based on selected state.
        filterArray = jQuery.grep(dataArray, function(item, i) {
            return item.terms[0].state == selectedstate;
        });
        updateTable(filterArray);
    });

    //To update the table element with selected state and display latest data
    updateTable = function(collection) {
        var $container = $("#details").find("tbody");
        table.clear();
        $container.empty();
        for (var i = 0; i < collection.length; i++) {
            table.row.add([collection[i].name.official_full,
                collection[i].terms[collection[i].terms.length - 1].start,
                collection[i].terms[collection[i].terms.length - 1].end,
                collection[i].terms[collection[i].terms.length - 1].type,
                collection[i].terms[collection[i].terms.length - 1].party
            ]).draw(true);
        }
    }
})
