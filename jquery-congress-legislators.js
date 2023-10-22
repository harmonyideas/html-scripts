// Declare variables
const dataArray = [];
const table = $("#details").DataTable({
	columnDefs: [{
		targets: -1,
		defaultContent: "<i>Unavailable</i>"
	}],
	columns: [
		null,
		null,
		null,
		null,
		null,
		{
			defaultContent: "<i>Unavailable</i>"
		},
		{
			fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
				if (oData[5]) {
					$(nTd).html(
						`<a href='https://www.c-span.org/person/?${oData[5]}'>CSPAN link</a>`
					);
				}
			}
		}
	]
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

// Update the datatable with a filtered list of legislators
async function updateTable(filterArray) {
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
	$stateDropDown.change(async function() {
		const selectedState = this.value;
		const filterArray = dataArray.filter(
			(legislator) => legislator.terms[0].state === selectedState
		);
		await updateTable(filterArray);
	});

	// Add click event listeners to the datatable
	$("#details").delegate("tr.rows", "click", function() {
		alert("Click!");
	});

	$("#details").on("click", "td", function(e) {
		const table = $("#details").DataTable();
		const data = table.row(e.target.closest("tr")).data();
	});
}

init();
