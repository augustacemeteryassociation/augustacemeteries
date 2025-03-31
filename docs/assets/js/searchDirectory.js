

function serialize() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const key = Array(10).fill('').map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return key
}

function arrWordFilter(words, filterWords) {

	var filteredArr = []

	words.forEach(word => {
		if (!filterWords.includes(word) && word.length > 1) {
			filteredArr.push(word)
		}
	})

	if (filteredArr.length == 0) {
		filteredArr = [""]
	}

	return filteredArr
	
}


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
	
	if (yearDiff == 0) { return 0; }
	if (dobMonth == undefined || dodMonth == undefined) { return yearDiff; }
	
	if (dodMonth < dobMonth) { if (yearDiff == 1) { return 0 } else { return yearDiff-1; }}
	if (dodMonth >= dobMonth) { 
		if (dobDay == undefined || dodDay == undefined) { return yearDiff; } 
		if (dobMonth == dodMonth && dodDay < dobDay) { return yearDiff-1; } else { return yearDiff; } 
	}

}


function getYear(dateStr) {
	var dateObj = getDate(dateStr)
	return dateObj['year']
}











// INIT

const records = new Map()
const allNamesMap = new Map()

const lotIDs = new Map()

const firstNames = new Map()
const middleNames = new Map()
const lastNames = new Map()
const maidenNames = new Map()
const otherInfoNames = new Map()
const plotOwnerNames = new Map()

$().ready(function () {

	var cemeteryData = null;

	$.getJSON("json/graves.json", function (data) {
		cemeteryData = data

		for (cemetery in data) {

            for (blockNum in data[cemetery]) {
                for (lotNum in data[cemetery][blockNum]) {
                    for (graveNum in data[cemetery][blockNum][lotNum]) {




                        for (g in data[cemetery][blockNum][lotNum][graveNum]) {

                            let d = data[cemetery][blockNum][lotNum][graveNum][g]

							// Get new unique record ID
                            do {
                                recordID = serialize();
                            } while (records.has(recordID))

                            // If record is blank or invalid, skip
                            // if (d['fName'] == "" && d['lName'] == "") { continue }

							let isInfant = false
							let infantFilterWords = ["infant", "baby"]

							if (infantFilterWords.some(word => d['otherInfo'].toLowerCase().includes(word))) { isInfant = true }

                            record = {
                                "firstName": d["fName"],
                                "middleName": d["mName"],
                                "lastName": d["lName"],
                                "maidenName": d["maidenName"],
								"nickname": d["otherInfo"],
                                "dateOfBirth": d["dateOfBirth"],
                                "birthYear": getYear(d["dateOfBirth"]),
                                "deathYear": getYear(d["dateOfDeath"]),
                                "dateOfDeath": d["dateOfDeath"],
                                "estimatedAge": yearDiff(d['dateOfBirth'], d['dateOfDeath']),
								"plotOwner": d["plotOwner"],
                                "cemetery": cemetery.replace("Lawn", ""),
                                "blockNum": blockNum,
                                "lotNum": lotNum,
                                "graveNum": `${graveNum}${g}`,
								"isInfant": isInfant
                            }

							// if (isInfant) {
							// 	console.log(record)
							// }

							// console.log(record.firstName.toLowerCase())

							let otherInfoArr = filterInput(record.nickname.toLowerCase(), ["special"]).split(" ")
							let otherInfoFilterWords = ["", "infant", "infants", "child", "baby", "son", "sons", "daughter", "daughters", "of", "not", "available", "twin", "twins", "and", "mr", "mrs", "jr", "rev"]


							nickNameWordsRemove = ["us", "army", "veteran", "infantry", "available", "buried", "tree", "killed"]
							nickNameWordsRemove.forEach(word => {
								if (otherInfoArr.includes(word)) {
									otherInfoArr = [""]
								}
							})

							if (otherInfoArr.length > 1 && otherInfoArr[0] != "") {
								otherInfoArr =  arrWordFilter(otherInfoArr, otherInfoFilterWords)
								// console.log(otherInfoArr)
								
								
								if (otherInfoArr.length >= 1) {
									otherInfoArr.forEach(name => {

										if (name == "") { return; }
										if (!otherInfoNames.has(name.toLowerCase())) {
											otherInfoNames.set(name.toLowerCase(), []);
										}

										otherInfoNames.get(name.toLowerCase()).push(record)
									})
								}
							}


							let plotOwners = record.plotOwner.split(" ")
							let filteredPlotOwners = []
							
							plotOwners.forEach(name => {
								name = filterInput(name.toLowerCase(), ["special", "numbers"])
								let filteredWords = ["and", "tree", "road", "mr", "mrs", "sr", "jr", "rev", "dr", "of", "not", "available", "for"]
								if (name != "" && name.length > 1 && !filteredWords.includes(name)) {
									filteredPlotOwners.push(name)

									if (!plotOwnerNames.has(name.toLowerCase())) {
										plotOwnerNames.set(name.toLowerCase(), []);
									}

									plotOwnerNames.get(name.toLowerCase()).push(recordID)
								}
							})

							// if (filteredPlotOwners.length >= 1) {
							// 	console.log(filteredPlotOwners)
							// }

							if (!firstNames.has(record.firstName.toLowerCase())) {
								firstNames.set(record.firstName.toLowerCase(), []);
							}

							if (!middleNames.has(record.middleName.toLowerCase())) {
								middleNames.set(record.middleName.toLowerCase(), []);
							}

							if (!lastNames.has(record.lastName.toLowerCase())) {
								lastNames.set(record.lastName.toLowerCase(), []);
							}

							if (!maidenNames.has(record.maidenName.toLowerCase()) && record.maidenName != "") {
								maidenNames.set(record.maidenName.toLowerCase(), []);
							}

							

							
                            

                            

                            // Set record key
                            records.set(recordID, record)


							firstNames.get(record.firstName.toLowerCase()).push(recordID);
							middleNames.get(record.middleName.toLowerCase()).push(recordID);
							lastNames.get(record.lastName.toLowerCase()).push(recordID);
							if (record.maidenName != "") {
								maidenNames.get(record.maidenName.toLowerCase()).push(recordID);
							}

							// if (record.nickname != "") {
							// 	nicknames.get(record.nickname.toLowerCase()).push(record);
							// }

                        }
                    }
                }
            }
        }
    }).then(function() {

		// Combine all the names into one map

		let nameMaps = [firstNames, middleNames, lastNames, maidenNames, otherInfoNames, plotOwnerNames]

		for (mapID in nameMaps) {

			let map = nameMaps[mapID]

			map.forEach((ids, name, map) => {

				// If name doesn't exist, create it
				if (!allNamesMap.has(name)) { allNamesMap.set(name, []); }

				ids.forEach(id => {

					let mapKeys = allNamesMap.get(name)

					// If the id isn't in the specified name in the map, add it
					if (!mapKeys.includes(id)) { mapKeys.push(id); }
				})
			})
		}

		// console.log(allNamesMap)
		// TODO: Implement this filter into the getMatches function
		// Example of how to filter names
		allNamesMap.forEach((ids, name, map) => {
			if (name.includes("john")) {
				console.log(name, ids)
			}
		})
	})

	var $results = $("#directoryResults")

	function getMatches(locationInput, blockInput, lotInput, nameInput) {

		// console.log(locationInput, blockInput, lotInput, nameInput)
		let titleText = "Cemetery Directory";
		if (locationInput != "any") {
			titleText += ` - ${locationInput.charAt(0).toUpperCase() + locationInput.slice(1)} Lawn`
		}

		if (blockInput != "") {
			titleText += ` - Block ${blockInput}`
		}

		if (lotInput != "") {
			titleText += ` - Lot ${lotInput}`
		}

		if (nameInput != "") {	
			titleText += ` : ${nameInput}`
		}

		$("title").html(titleText);

		$results.empty();

			//
			// CEMETERY SEARCH
			//
			if (cemeteryData == null) { return ; }

			for (cemetery in cemeteryData) {

				// Check if cemetery location is valid, else continue to next cemetery
				if (locationInput != "any" && !cemetery.toLowerCase().includes(locationInput)) { continue; }
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

						let hasName = nameInput != "" ? false : true

						let $record = $(`div #${locName}-${blockNum}-${lotNum}`)

						$record.append(`<table id="${locName}-${blockNum}-${lotNum}"></table>`)
						let $table = $(`table#${locName}-${blockNum}-${lotNum}`)
						
						$table.append(`

						<thead>
							<tr>
								<th>Grave #</th>
								<th>Name</th>
								<th>Plot Owner</th>
								<th>Burial Date</th>
							</tr>
						</thead>
						<tbody></tbody>

						`)

						// TODO: Update how this works, in terms of the matching the names to the maps
						let $tbody = $(`table#${locName}-${blockNum}-${lotNum} > tbody`)
						
						for (graveNum in cemeteryData[cemetery][blockNum][lotNum]) {
							for (g in cemeteryData[cemetery][blockNum][lotNum][graveNum]) {

								let d = cemeteryData[cemetery][blockNum][lotNum][graveNum][g]


								let fName = d["fName"]
								let mName = d["mName"]
								let lName = d["lName"]
								let burialDate = d["burialDate"]
								let maidenName = d["maidenName"]
								let otherInfo = d["otherInfo"]
								let plotOwner = d["plotOwner"]

								// let dob = getDate(d["dateOfBirth"])
								// let dod = getDate(d["dateOfDeath"])																			

								let fullName = maidenName != "" ? `${fName} ${mName} <i>${maidenName}</i> ${lName}` : `${fName} ${mName} ${lName}`
								fullName = d["graveLink"] != "" ? `<a href="${d["graveLink"]}" target="_blank">${fullName}</a>` : fullName


								
								
								if ((fullName.toLowerCase().includes(nameInput.toLowerCase()) ||  plotOwner.toLowerCase().includes(nameInput.toLowerCase())) && (nameInput != "")) {
									hasName = true

									$tbody.append(`
										<tr class="highlight">
											<td class="graveNum">${graveNum}${g}</td>
											<td class="fullName">${fullName}</td>
											<td class="plotOwner">${plotOwner}</td>
											<td class="burialDate">${burialDate}</td>
										</tr>
									`);

								} else {
									$tbody.append(`
										<tr>
											<td class="graveNum">${graveNum}${g}</td>
											<td class="fullName">${fullName}</td>
											<td class="plotOwner">${plotOwner}</td>
											<td class="burialDate">${burialDate}</td>
										</tr>
									`);
								}
									
							}

							
						}

						// Remove record, if nameInput is empty, or name is not found in reocrd
						if (!hasName) { $record.remove() }

					}
				}
			}
		}
	

	

	$("select").change(function () {
		window.stop();
		$("#directoryResults").empty();
		var blockID = $(this).children("option:selected").val();
	});

	var initOption = $("select").children("option:selected").val();



	//
	// FORM SUBMITION
	//

	$("form").submit(function () {

		var $results = $("#directoryResults")

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
		let lotInput = filterInput(values['lot_input'].toUpperCase(), ["scripts", "special", "extraSpaces"]);
		let nameInput =  filterInput(values['name_input'], ["scripts", "special"]);

		// console.log(locationInput, blockInput, lotInput, nameInput)



		// Display filtered input back into the form
		$("#block_input:text").val(blockInput);
		$("#lot_input:text").val(lotInput);
		$("#name_input:text").val(nameInput);


		//TODO: Update how name inputs are matched with the records map
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