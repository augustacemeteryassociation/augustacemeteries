function cleanString(s) {
	return s.replace(/[^a-zA-Z ]/g, "");
}

function filterInput(input, filterType) {

	for (const f in filterType) {
		switch (filterType[f]) {
			case "alphabet":
				input = input.replace(/[a-zA-Z]/g, "")
				break;
			case "numbers":
				input = input.replace(/[0-9]/g, "");
				break;
			case "scripts": 
				input = input.replace(/((?=\<)(.*?)(?=\>)|(?=\>)(.*?)(?=\<))|[/</>]/g, "");
				break;
			case "special":
				input = input.replace(/[^a-zA-Z0-9 ]/g, "")
				break;
			case "spaces":
				input = input.replace(/[\s]/g, "");
				break;
			case "date":
				input = input.replace(/([^0-9-])/g, "");
				break;
			case "extraSpaces":
				input = input.replace(/[ ]{2,}/g, "");
		}
	}

	return input
}


function yearDiff(dob, dod) {

	var dobDate = getDate(dob)
	var dodDate = getDate(dod)

	var dobYear = dobDate['year'];
	var dobMonth = dobDate['month'];
	var dobDay = dobDate['day'];

	var dodYear = dodDate['year'];
	var dodMonth = dodDate['month'];
	var dodDay = dodDate['day'];

	if (dobYear == "Unknown" || dodYear == "Unknown") { return "Unknown"; }

	var yearDiff = dodYear - dobYear;
	
	if (yearDiff == 0) { return "Less than a year"; }
	if (dobMonth == undefined || dodMonth == undefined) { return yearDiff; }
	
	if (dodMonth < dobMonth) { if (yearDiff == 1) { return "Less than a year" } else { return yearDiff-1; }}
	if (dodMonth >= dobMonth) { 
		if (dobDay == undefined || dodDay == undefined) { return yearDiff; } 
		if (dobMonth == dodMonth && dodDay < dobDay) { return yearDiff-1; } else { return yearDiff; } 
	}

}


function getDate(dateStr) {

	var d = {}
	dateArray = []

	function nan(a) {
		if (Number.isNaN(a)) { return "Unknown" } else { return a }
	}


	if (typeof(dateStr) == "string") {
		if (dateStr.includes("-")) {dateArray = dateStr.split("-")} else {dateArray[0] = dateStr}
	}
	

	var dateLen = dateArray.length

	switch (dateLen) {
		case 3:
			d.year = parseInt(dateArray[2]);
			d.month = parseInt(dateArray[0]);
			d.day = parseInt(dateArray[1]);

			d.year = nan(d.year)
			d.month = nan(d.month)
			d.day = nan(d.day)
			break;

		case 2:
			d.year = parseInt(dateArray[1]);
			d.month = parseInt(dateArray[0]);

			d.year = nan(d.year);
			d.month = nan(d.month);
			break;

		case 1:

			d.year = parseInt(dateArray[0]);
			d.year = nan(d.year);
			break;

		case '':
			d.year = "Unknown";
			break;
	}

	return d

}

function getDate_string(dateObject, dashFormat = false) {

	var year = dateObject.year
	var month = dateObject.month
	var day = dateObject.day

	if (dashFormat) {

		if (year == undefined) {return "Unknown"}
		if (month == undefined){return `${year}`}
		if (day == undefined) {return `${month}-${year}`}

		return `${month}-${day}-${year}`
	}

	if (year == undefined) { return "Unknown" }
	if (month == undefined) { return `${year}`}
	
	switch (month) {
		case 1:
			var monthStr = "January";
			break;
		case 2:
			var monthStr = "February";
			break;
		case 3:
			var monthStr = "March";
			break;
		case 4:
			var monthStr = "April";
			break;
		case 5:
			var monthStr = "May";
			break;
		case 6:
			var monthStr = "June";
			break;
		case 7:
			var monthStr = "July";
			break;
		case 8:
			var monthStr = "August";
			break;
		case 9:
			var monthStr = "September";
			break;
		case 10:
			var monthStr = "October";
			break;
		case 11:
			var monthStr = "November";
			break;
		case 12:
			var monthStr = "December";
			break;
	}

	if (day == undefined) {return `${monthStr} ${year}`}

	return `${monthStr} ${day}, ${year}`;
}


$().ready(function () {

	var cemeteryData = null;

	$.ajax({
		type: 'GET',
		dataType: 'json',
		// url: 'json/graves.json',
		url: 'https://directory-data.augustacemeteryassociation.workers.dev/',
		async: false,
		success: function (data) { 
			// console.log(data)
			cemeteryData = data; 
		}
	})

	// $.getJSON('https://directory-data.augustacemeteryassociation.workers.dev/', function(data) {
	// 	console.log(data);
	// }).fail(function(xhr, status, error) {
	// 	console.log(error);
	// });

	var $results = $("#results")

	function getMatches(locationInput, blockInput, lotInput, nameInput) {

		// console.log(locationInput, blockInput, lotInput, nameInput)

		$results.empty();

			//
			// CEMETERY SEARCH
			//
			if (cemeteryData == null) { return ; }

			for (cemetery in cemeteryData) {

				// Check if cemetery location is valid, else continue to next cemetery
				if (locationInput != "any" && !cemetery.includes(locationInput)) { continue; }
				let locName = cemetery.replace("Lawn", "")
				for (blockNum in cemeteryData[cemetery]) {

					// Check if block # is valid, else go to next block
					if (blockInput != "" && blockInput != blockNum) { continue; }
					for (lotNum in cemeteryData[cemetery][blockNum]) {

						// console.log(cemeteryData[cemetery][blockNum][lotNum])

						// Check if lot # is valid, else go to next lot
						if (lotInput != "" && lotInput != lotNum) { continue; }

						$results.append(`
							<div class="record" id="${locName}-${blockNum}-${lotNum}">
								<h3>${locName} Lawn - Block ${blockNum}, Lot ${lotNum}</h3>
							</div>
						`)

						let $record = $(`div #${locName}-${blockNum}-${lotNum}`)

						$record.append(`<table id="${locName}-${blockNum}-${lotNum}"></table><br>`)
						let $table = $(`table#${locName}-${blockNum}-${lotNum}`)
						
						$table.append(`

						<thead>
							<tr>
								<th>Grave #</th>
								<th>Name</th>
								<th>Plot Owner</th>
							</tr>
						</thead>
						<tbody></tbody>

						`)


						let $tbody = $(`table#${locName}-${blockNum}-${lotNum} > tbody`)

						for (graveNum in cemeteryData[cemetery][blockNum][lotNum]) {
							for (g in cemeteryData[cemetery][blockNum][lotNum][graveNum]) {

								let d = cemeteryData[cemetery][blockNum][lotNum][graveNum][g]


								let fName = d["fName"]
								let mName = d["mName"]
								let lName = d["lName"]
								let maidenName = d["maidenName"]
								let otherInfo = d["otherInfo"]
								let plotOwner = d["plotOwner"]

								// let dob = getDate(d["dateOfBirth"])
								// let dod = getDate(d["dateOfDeath"])																			

								let fullName = maidenName != "" ? `${fName} ${mName} <i>${maidenName}</i> ${lName}` : `${fName} ${mName} ${lName}`
								// console.log()
								$tbody.append(`
									<tr>
										<td>${graveNum}${g}</td>
										<td>${fullName}</td>
										<td>${maidenName}</td>
									</tr>
								`);
								
								
									
							}
						}

					}
				}
			}
		}
	

	

	$("select").change(function () {
		window.stop();
		$("#results").empty();
		var blockID = $(this).children("option:selected").val();
	});

	var initOption = $("select").children("option:selected").val();



	//
	// FORM SUBMITION
	//

	$("form").submit(function () {

		var $results = $("#results")

		window.stop();
		$results.empty()
		var $inputs = $('form :input');
		var values = {};
		var sortOption = $("#sortSelect").val();

		$inputs.each(function () {
			values[this.name] = $(this).val();
		});

		// console.log(values)

		let locationInput = values['locationSelection'];
		let blockInput = filterInput(values['block_input'].charAt(0).toUpperCase(), ["scripts", "special", "extraSpaces"]);
		let lotInput = filterInput(values['lot_input'], ["alphabet", "scripts", "special", "extraSpaces"]);
		let nameInput =  filterInput(values['name_input'], ["scripts", "special"]);

		// console.log(locationInput, blockInput, lotInput, nameInput)



		// Display filtered input back into the form
		$("#block_input:text").val(blockInput);
		$("#lot_input:text").val(lotInput);
		$("#name_input:text").val(nameInput);

		getMatches(locationInput, blockInput, lotInput, nameInput)

	});
});

// $(document).on('click', '.moreDetails', function () {

// 	var message = $(this).text().trim();

// 	if (message == "More Details") {
// 		$(this).html("<h2>Less Details</h2>");
// 	} else {
// 		$(this).html("<h2>More Details</h2>")
// 	}

// 	$(this).next().toggle(400, "swing");
// });

// $(document).on('click', '.resultMessage', function () {
// 	$(this).next(".results").toggle(400, "swing")
// });


// when image is loading, fade in
// $(document).on('load', 'img', function () {
// 	$(this).fadeIn(1000);
// });