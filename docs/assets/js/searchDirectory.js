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

	function replaceDashes(str) {

		if (str.includes('--')) {
			return str.replace(/--/g, '-');
		} else {
			return str;
		}
	}

	dateStr = replaceDashes(dateStr)

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
const burialYears = new Map()

$().ready(function () {

	var cemeteryData = null;

	async function serializeData(data) {

		cemeteryData = data; 

		for (cemetery in data) {
			for (blockNum in data[cemetery]) {
				for (lotNum in data[cemetery][blockNum]) {

					do {
						lotID = serialize();
					} while (lotIDs.has(lotID))

					let lotRecordIDs = []

					for (graveNum in data[cemetery][blockNum][lotNum]) {
						for (g in data[cemetery][blockNum][lotNum][graveNum]) {

							let d = data[cemetery][blockNum][lotNum][graveNum][g]

							// Get new unique record ID
							do {
								recordID = serialize();
							} while (records.has(recordID))

							lotRecordIDs.push(recordID)

							// If record is blank or invalid, skip
							// if (d['fName'] == "" && d['lName'] == "") { continue }

							let isInfant = false
							let infantFilterWords = ["infant", "baby"]

							if (infantFilterWords.some(word => d['otherInfo'].toLowerCase().includes(word))) { isInfant = true }

							let fullName = d["maidenName"] != "" ? `${d["fName"]} ${d["mName"]} <i>${d["maidenName"]}</i> ${d["lName"]}` : `${d["fName"]} ${d["mName"]} ${d["lName"]}`

							if (d["graveLink"] != "") { 
								fullName = `<a href="${d["graveLink"]}" target="_blank">${fullName}</a>`
							}

							let burialYear = getYear(d["burialDate"]).toString()
							if (burialYear == "Unknown" || burialYear.length != 4) { burialYear = "Unknown" }

							record = {
								"firstName": d["fName"],
								"middleName": d["mName"],
								"lastName": d["lName"],
								"maidenName": d["maidenName"],
								"fullName": fullName,
								"nickname": d["otherInfo"],
								"dateOfBirth": d["dateOfBirth"],
								"birthYear": getYear(d["dateOfBirth"]),
								"deathYear": getYear(d["dateOfDeath"]),
								"dateOfDeath": d["dateOfDeath"],
								"burialDate": d["burialDate"],
								"burialYear": burialYear,
								"estimatedAge": yearDiff(d['dateOfBirth'], d['dateOfDeath']),
								"plotOwner": d["plotOwner"],
								"cemetery": cemetery.replace("Lawn", ""),
								"blockNum": blockNum,
								"lotNum": lotNum,
								"lotID": lotID,
								"graveNum": `${graveNum}${g}`,
								"isInfant": isInfant,
								"recordID": recordID,
								"graveLink": d["graveLink"]
							}



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
								
								if (otherInfoArr.length >= 1) {
									otherInfoArr.forEach(name => {

										if (name == "") { return; }
										if (!otherInfoNames.has(name.toLowerCase())) {
											otherInfoNames.set(name.toLowerCase(), []);
										}

										otherInfoNames.get(name.toLowerCase()).push(recordID)
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


							if (!burialYears.has(record.burialYear.toString())) {
								burialYears.set(record.burialYear.toString(), []);
							}

							burialYears.get(record.burialYear.toString()).push(recordID);

						}
					}

					// Set Lot ID and matching record IDs
					lotIDs.set(lotID, {
						"recordIDs": lotRecordIDs,
						"Block": blockNum,
						"Lot": lotNum,
						"Cemetery": cemetery.replace("Lawn", ""),
					});

				}
			}
		}
	}


	async function combineNameMaps() {

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

	}

	$.ajax({
		type: 'GET',
		dataType: 'json',
		// url: './json/graves.json',
		url: 'https://directory-data.augustacemeteryassociation.workers.dev/',
		async: false,
		success: function (data) { 
			serializeData(data);
		},
		error: function (xhr, status, error) {
			console.error('Error fetching JSON data');
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: './json/graves.json',
				async: false,
				success: async function (data) {
					await serializeData(data);
					await combineNameMaps();
				}
			});
		}
	});

	var $results = $("#directoryResults")

	function getMatches(locationInput, blockInput, lotInput, nameInput, burialYear, nameSortInput) {

		var matches = []
		var blockMatches = []
		var burialYearMatches = []
		var lotMatches = []
		var uniqueResultMap = new Map();

		if (burialYear != "" && burialYear.length == 4) { burialYearMatches = burialYears.get(burialYear) }

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

		if (burialYear != "" && nameInput == "") {
			titleText += ` [${burialYear}]`
		}

		if (nameInput != "") {

			let nameInputs = filterInput(nameInput, ["special", "numbers"]).toLowerCase().split(" ")
			nameInputs = nameInputs.filter(name => name != "")

			if (nameInput != "" && nameInputs.length > 1) {
			
				titleText += ` : ${nameInputs.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ")}`
			} else if (nameInput != "" && nameInputs.length == 1) {
				titleText += ` : ${nameInputs[0].charAt(0).toUpperCase() + nameInputs[0].slice(1)}`
			}

			if (burialYear != "") {
				titleText += ` [${burialYear}]`
			}
			
			nameInputs.forEach(nameIn => {

				allNamesMap.forEach((ids, name, map) => {
					
					if (!uniqueResultMap.has(nameIn)) {
						uniqueResultMap.set(nameIn, [])
					}


					if (name.includes(nameIn)) {

						ids.forEach(id => {

							if (nameSortInput == "exact" && nameInputs.length > 1) {
								if(uniqueResultMap.get(nameIn).includes(id)) { return; }
								uniqueResultMap.get(nameIn).push(id)
								return;
							}


							if (matches.includes(id)) { return; }

							matches.push(id)


							// lot = records.get(id).lotID
							
							// if (!lotMatches.includes(lot)) {
							// 	lotMatches.push(lot)
							// }
						})
					}
				})
			})

			// TODO: Find a way to find common ids between all unique names (Currently working, need to debug to make sure everything is working correctly)
			if (nameSortInput == "exact" && nameInputs.length > 1) {

				uniqueResults = []

				uniqueResultMap.forEach((ids, name, map) => {
					ids.forEach(id => {
						uniqueResults.push(id)
					})
				})
		
				matches = [...new Set(uniqueResults.filter((item, index) => uniqueResults.indexOf(item) !== index))];

			}

			

			// TODO: Add logic to find valid lots (Think this is working correctly, double check and debug)

			matches.forEach(id => {
				let lotID = records.get(id).lotID
				// let recordInfo = records.get(id)
				let lotInfo = lotIDs.get(lotID)


				if (locationInput == "any" || locationInput == lotInfo.Cemetery.toLowerCase()) {

					if (blockInput == "" && lotInput == "") { lotMatches.push(lotID); return;}
					if ((blockInput != "" && blockInput == lotInfo.Block) && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
					if (lotInput == "" && (blockInput != "" && blockInput == lotInfo.Block)) { lotMatches.push(lotID); return; }
					if (blockInput == "" && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }

				}

				// if (lotMatches.includes(lotID)) { return; }

				// if (blockInput == "" && lotInput == "") {
				// 	lotMatches.push(lotID)
				// }

				// if (blockInput != "" && blockInput == recordInfo.blockNum) {
				// 	lotMatches.push(lotID)
				// }

				// if (lotInput != "" && lotInput == recordInfo.lotID) {
				// 	lotMatches.push(lotID)
				// }
			
			})
		}


		if (matches.length == 0) {
			matches = burialYearMatches
		} else {
			// Filter matches by burial year if specified
			let tempMatches = []
			matches.forEach(id => {
				if (burialYearMatches.includes(id)) {
					tempMatches.push(id)
				}
			})

			if (tempMatches.length > 0) {
				matches = tempMatches
			}
		}



		// TODO: Add logic to find valid lots and blocks if no name is entered
		if (nameInput == "") {

			lotIDs.forEach((lot, lotID, map) => {

				lotInfo = lotIDs.get(lotID)
				

				if (locationInput == "any" || locationInput == lotInfo.Cemetery.toLowerCase()) {

					if (blockInput == "" && lotInput == "") { return; }
					if ((blockInput != "" && blockInput == lotInfo.Block) && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
					if (lotInput == "" && (blockInput != "" && blockInput == lotInfo.Block)) { lotMatches.push(lotID); return; }
					if (blockInput == "" && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }

				}
				
				return

			})
		}


		if (matches.length > 0 && lotMatches.length == 0) {
			lotMatches = [...new Set(matches.map(id => records.get(id).lotID))];
		}

		// if (matches.length == 0 && burialYearMatches.length > 0) {
		// 	matches = burialYearMatches
		// }
		

		if (matches.length >= 0 && lotMatches.length == 0) {

			$results.empty();

			$results.append(`
				<h1 class="errorMessage">
					No Results Found
				</h1>
			`)

			return;
		}

		let orderedMatches = []
		let orderedLots = []


		lotIDs.forEach((lot, lotID, map) => {
			if (lotMatches.includes(lotID)) {
				orderedLots.push(lotID)
			}
		})


		// let diff = []

		// if (matches.length != orderedMatches.length) {
			
		// 		matches.forEach(id => {
		// 			if (!orderedMatches.includes(id)) {
		// 				diff.push(id)
		// 			}
		// 		})

		// }


		$("title").html(titleText);

		$results.empty();

		//
		// CEMETERY SEARCH
		//
		if (cemeteryData == null) { return ; }


		orderedLots.forEach(lotID => {

			lotInfo = lotIDs.get(lotID)

			if (locationInput != "any") {
				if (lotInfo.Cemetery.toLowerCase() != locationInput) { return; }
			}

			if (blockInput != "") {
				if (lotInfo.Block != blockInput) { return; }
			}

			if (lotInput != "") {
				if (lotInfo.Lot != lotInput) { return; }
			}



			$results.append(`
				<div class="record" id="LOT_${lotID}">
					<h3>${lotInfo.Cemetery} Lawn - Block ${lotInfo.Block}, Lot ${lotInfo.Lot}</h3>
				</div>
			`)

			let $record = $(`div #LOT_${lotID}`)

			$record.append(`<table id="TABLE_${lotID}"></table>`)
			let $table = $(`table#TABLE_${lotID}`)
			
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

			let $tbody = $(`table#TABLE_${lotID} > tbody`)

			lotInfo.recordIDs.forEach(recID => {

				let record = records.get(recID)
				let isHighlighted = ""

				if (matches.includes(recID)) {
					isHighlighted = "highlight"
				} 

				if (burialYear != "" && burialYear.length == 4) {
					if (record.burialDate.includes(burialYear)) {
						isHighlighted = "highlight"
					} else {
						isHighlighted = ""
					}
				}

				$tbody.append(`
					<tr class="${isHighlighted}">
						<td class="graveNum">${record.graveNum}</td>
						<td class="fullName">${record.fullName}</td>
						<td class="plotOwner">${record.plotOwner}</td>
						<td class="burialDate">${record.burialDate}</td>
					</tr>
				`);
		
			})
		})
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

		let locationInput = values['locationSelection'];
		let blockInput = filterInput(values['block_input'].charAt(0).toUpperCase(), ["scripts", "special", "extraSpaces"]);
		let lotInput = filterInput(values['lot_input'].toUpperCase(), ["scripts", "special", "extraSpaces"]);
		let nameInput =  filterInput(values['name_input'], ["scripts", "special"]);
		let burialYear = filterInput(values['burialYear_input'], ["scripts", "alphabet", "special", "extraSpaces"]);

		if (burialYear.length > 4) { burialYear = burialYear.slice(0,4); }

		let nameSortInput = values['nameSelection'];


		// Display filtered input back into the form
		$("#block_input:text").val(blockInput);
		$("#lot_input:text").val(lotInput);
		$("#name_input:text").val(nameInput);
		$("#burialYear_input:text").val(burialYear);


		//TODO: Update how name inputs are matched with the records map
		getMatches(locationInput, blockInput, lotInput, nameInput, burialYear, nameSortInput)

	});
});