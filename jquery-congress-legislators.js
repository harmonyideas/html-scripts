// Declare variables
const dataArray = [];

var table = $("#details").DataTable({
  columns: [
    { title: "Name" },
    { title: "Start Term" },
    { title: "End Term" },
    { title: "Type" },
    { title: "Party" },
    { title: "CSPAN ID", defaultContent: "Unavailable" },
  ],
});

// Load JSON data
async function loadJSON() {
  const response = await fetch("data/congress-legislators.json");
  const data = await response.json();
  dataArray.push(...data);
}

// Create a list of states
async function createStateList() {
  const statesArray = [];
  const states = dataArray[0].states;
  for (const [abbreviation, fullName] of Object.entries(states)) {
    statesArray.push([abbreviation, fullName]);
  }
  statesArray.sort();
  return statesArray;
}

// Add a new row for each legislator in the filter array.
async function updateTable(filterArray) {
  // Clear the table before adding new rows.
  table.clear();
  for (const legislator of filterArray) {
    table.row.add([
      legislator.name.official_full,
      legislator.terms[legislator.terms.length - 1].start,
      legislator.terms[legislator.terms.length - 1].end,
      legislator.terms[legislator.terms.length - 1].type,
      legislator.terms[legislator.terms.length - 1].party,
      legislator.id.cspan
    ]).draw(true);
  }
}

// Initialize the page
async function init() {
  await loadJSON();
  const statesArray = await createStateList();

  // Build the state dropdown
  const $stateDropDown = $("#DropDown_State");
  for (const state of statesArray) {
    const [abbreviation, fullName] = state;
    $stateDropDown.append(`<option value="${abbreviation}">${fullName}</option>`);
  }

  // Filter the legislators on state change
  $stateDropDown.change(async function () {
    const selectedState = this.value;
    const filterArray = dataArray.filter(
      (legislator) => legislator.terms[0].state === selectedState
    );
    await updateTable(filterArray);
  });

  // Add click event listeners to the datatable
  $("#details").delegate("tr.rows", "click", function () {
    alert("Click!");
  });

  $("#details").on("click", "td", function (e) {
    const table = $("#details").DataTable();
    const data = table.row(e.target.closest("tr")).data();
  });
}

init();
