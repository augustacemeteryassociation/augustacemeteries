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


function yearDiff(d1, d2) {


	let date1 = new Date(d1);
	let date2 = new Date(d2);

	let d1Arr = d1.split("-")
	let d2Arr = d2.split("-")

	let d1ArrYear = d1Arr[d1Arr.length - 1]
	let d2ArrYear = d2Arr[d2Arr.length - 1]

	let d2YearVal = Number.isInteger(parseInt(d2ArrYear)) ? parseInt(d2ArrYear) : NaN;
	let d1YearVal = Number.isInteger(parseInt(d1ArrYear)) ? parseInt(d1ArrYear) : NaN;

	let d2Time = date2.getTime();
	let d1Time = date1.getTime();

	let timeYearDiff = Math.floor((d2Time - d1Time) / 31536000000);
	let yearDiff = Math.floor(d2YearVal - d1YearVal)


	if (isNaN(timeYearDiff)) {

		if (isNaN(yearDiff)) { yearDiff = "Unknown" } else if (yearDiff == 0) { yearDiff = "Less than 1 year" }

		return yearDiff

	}

	if (timeYearDiff == 0) { timeYearDiff = "Less than 1 year" }

	return timeYearDiff

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

	var $results = $("#results")

	function getMatches(fName_input, lName_input, sortOption, dobInput, dodInput) {

		$results.empty();

		dates = []

		function concatDate (date) {
			dateLength = Object.keys(date).length;

			switch (dateLength) {
				case 1:
					return `${date.year}`
				case 2:
					return `${date.month}-${date.year}`
				case 3:
					return `${date.month}-${date.day}-${date.year}`
			}	
		
		}

		let dobString = ""
		let dodString = ""

		if (dobInput != "") {
			dates.push(dobInput); 
			dobInput = getDate(dobInput);
			dobString = typeof(dobInput) == "object" ? concatDate(dobInput) : "";
		}

		if (dodInput != "") {
			dates.push(dodInput);
			dodInput = getDate(dodInput);
			dodString = typeof(dodInput) == "object" ? concatDate(dodInput) : "";
		}

		var original_fName = fName_input
		var original_lName = lName_input

		fName_input = fName_input.toLowerCase();
		lName_input = lName_input.toLowerCase();

		$.getJSON("json/graves.json", function (data) {

			let exactMatch = []
			let exactDate = []
			let potentialMatch = []
			let fNameMatch = []
			let lNameMatch = []
			let dobMatch = []
			let dodMatch = []

			var fName_inputLower = fName_input.toLowerCase();
			var lName_inputLower = lName_input.toLowerCase();
			var count = 0;

			var compareObjects = function (a, b) {

				var fName_a = a.fName.toLowerCase();
				var fName_b = b.fName.toLowerCase();

				var lName_a = a.lName.toLowerCase();
				var lName_b = b.lName.toLowerCase();


				if (fName_a < fName_b) { return -1 }
				if (fName_a > fName_b) { return 1 }

				if (lName_a < lName_b) { return -1 }
				if (lName_a > lName_b) { return 1 }

			}

			var compareDeathDates = function (a, b) {

				let a_dod = new Date(a.dateOfDeath).getTime();
				let b_dod = new Date(b.dateOfDeath).getTime();

				if (a_dod < b_dod) { return -1 }
				return 1
				
			}

			var compareAge = function (a,b) {
				let a_age = yearDiff(a.dateOfBirth, a.dateOfDeath)
				let b_age = yearDiff(b.dateOfBirth, b.dateOfDeath)

				if (a_age < b_age) {return -1}
				return 1
			}


			//
			// CEMETERY SEARCH
			//

			for (cemetery in data) {

				$("results").append(cemetery);

				for (blockNum in data[cemetery]) {
					for (lotNum in data[cemetery][blockNum]) {
						for (graveNum in data[cemetery][blockNum][lotNum]) {
							for (g in data[cemetery][blockNum][lotNum][graveNum]) {
								let d = data[cemetery][blockNum][lotNum][graveNum][g]

								d['cemetery'] = cemetery
								d['blockNum'] = blockNum
								d['lotNum'] = lotNum
								d['graveNum'] = graveNum
								d['graveSubNum'] = g

								let fName = d["fName"].toLowerCase()
								let mName = d["mName"].toLowerCase()
								let lName = d["lName"].toLowerCase()
								let maidenName = d["maidenName"].toLowerCase()
								let otherInfo = d["otherInfo"].toLowerCase()
								let dob = getDate(d["dateOfBirth"])
								let dod = getDate(d["dateOfDeath"])


								// 
								// MATCH CASES
								// 
								function checkForMatches (fNameSearch, lNameSearch, bothSearch, isDoB, isDoD) {

									var isMatch = false

									// Name Search
									if (fName == "" && lName == "") {return}
									if (fNameSearch && fName != "" && (fName.includes(fName_inputLower) || otherInfo.includes(fName_inputLower))) {fNameMatch.push(d); isMatch = true}
									if (lNameSearch && lName != "" && (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower)))) {lNameMatch.push(d); isMatch = true}
									if (bothSearch && (fName.includes(fName_inputLower) || otherInfo.includes(fName_inputLower)) && (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower) && maidenName != ""))){ exactMatch.push(d); isMatch = true}

									// Date Search
									if (isDoB && isDoD) {exactDate.push(d);}
									if (isDoB) {dobMatch.push(d)}
									if (isDoD) {dodMatch.push(d)}

									// Potential Search
									if (isMatch && (isDoB || isDoD)) {potentialMatch.push(d)}

									
								}

								function compareDates(r, i) {

									if (typeof(r) == 'object') {rLen = Object.keys(r).length;} else {return false}
									if (typeof(i) == 'object') {iLen = Object.keys(i).length;} else {return false}

									if (rLen >= iLen) { k = Object.keys(i) } else { k = Object.keys(i) }

									for (const d of k) {
										if (r[d] != i[d]){
											return false
										}

									return true

									}
								}
								

								// Find Match Cases

								isDoB = compareDates(dob, dobInput)
								isDoD = compareDates(dod, dodInput)

								if (original_fName != "") {
									if (original_lName != "") {
										checkForMatches(true, true, true, isDoB, isDoD)
									} else {
										checkForMatches(true, false, false, isDoB, isDoD)
									}
								} else if (original_lName != "") {
									checkForMatches(false, true, false, isDoB, isDoD)
								}

								

								if (isDoB || isDoD) { 
									
								} 


								// BACKUP SORTER - ORIGINAL
								// if (fName != "") {
								// 	if (lName != "") {
								// 		if (fName.includes(fName_input) || otherInfo.includes(fName_input)) {
								// 			if (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower) && maidenName != "")) {
								// 				exactMatch.push(d);
								// 			} else {
								// 				fNameMatch.push(d);
								// 			}
								// 		} else {
								// 			if (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower) && maidenName != "")) {
								// 				lNameMatch.push(d)
								// 			}
								// 		}
								// 	}
								// }
							}
						}
					}
				}
			}

			//
			// SORTING OPTIONS
			//

			switch (sortOption) {
				case "name":
					exactMatch.sort(compareObjects);
					exactDate.sort(compareObjects);
					potentialMatch.sort(compareObjects);
					fNameMatch.sort(compareObjects);
					lNameMatch.sort(compareObjects);
					break;

				case "dod_latest":
					exactMatch.sort(compareDeathDates).reverse();
					exactDate.sort(compareDeathDates).reverse();
					potentialMatch.sort(compareDeathDates).reverse();
					fNameMatch.sort(compareDeathDates).reverse();
					lNameMatch.sort(compareDeathDates).reverse();
					break;

				case "dod_oldest":
					exactMatch.sort(compareDeathDates);
					exactDate.sort(compareDeathDates);
					potentialMatch.sort(compareDeathDates);
					fNameMatch.sort(compareDeathDates);
					lNameMatch.sort(compareDeathDates);
					break;
				
				case "age_youngest":
					exactMatch.sort(compareAge);
					exactDate.sort(compareAge);
					potentialMatch.sort(compareAge);
					fNameMatch.sort(compareAge);
					lNameMatch.sort(compareAge);
					break;
				
				case "age_oldest":
					exactMatch.sort(compareAge).reverse();
					exactDate.sort(compareAge).reverse();
					potentialMatch.sort(compareAge).reverse();
					fNameMatch.sort(compareAge).reverse();
					lNameMatch.sort(compareAge).reverse();

				case "default":
					break;
			}

			
			var isExactMatch = exactMatch.length >= 1
			var isExactDate = exactDate.length >= 1
			var isPotentialMatch = potentialMatch.length >= 1
			var isFNameMatch = fNameMatch.length >= 1
			var isLNameMatch = lNameMatch.length >= 1
			var isDoBMatch = dobMatch.length >= 1
			var isDoDMatch = dodMatch.length >= 1
	

			// DEBUGGER FOR MATCHES
			// console.log("fName:", original_fName, fNameMatch, isFNameMatch)
			// console.log("lName:", original_lName, lNameMatch, isLNameMatch)
			// console.log("exactMatch:", exactMatch, isExactMatch)
			// console.log("exactDate:", exactDate, isExactDate)
			// console.log("dob:", dobString, dobMatch, isDoBMatch)
			// console.log("dod:", dodString, dodMatch, isDoDMatch)
			// console.log("Potential match:", potentialMatch, isPotentialMatch)
			// console.log("\n\n")


			//
			// Print RESULTS
			// 

			var isHidden = false

			// Print No Matches if there are none
			if (!isFNameMatch && !isLNameMatch && !isExactMatch && !isDoBMatch && !isDoDMatch && !isExactMatch) {
				if (!isExactMatch && (original_fName != "" || original_lName != "")) {
					$results.append(`<h1 class='errorMessage'>Sorry we couldn't find any results for:<br> <span>${original_fName == "" ? "": original_fName} ${original_lName == "" ? "": original_lName}</h1>`);
				} else if (!isExactDate &&  (dobString != "" && dodString != "")) {
					$results.append(`<h1 class='errorMessage'>Sorry we couldn't find any results for:<br> <span>${dobString} or ${dodString}</h1>`);
				} else if (original_fName == "" && original_lName == "") {
					if ((!isDoBMatch && dodString == "") || (!isDoDMatch && dobString == "")) {
						$results.append(`<h1 class='errorMessage'>Sorry we couldn't find any results for:<br><span>${dobString}${dodString}</h1>`);
					}
				}
			}



			// Print Exact Matches
			if (isExactMatch || isExactDate) {
				if (isExactMatch) { printPersonResult(exactMatch, `There ${exactMatch.length == 1 ? 'is' : 'are'} ${exactMatch.length} exact ${exactMatch.length == 1 ? 'match' : 'matches'} for`, original_fName, original_lName, "exactMatch", isHidden); isHidden = true;} 
				if (isExactDate) {printPersonResult(exactDate, `There ${exactDate.length == 1 ? 'is' : 'are'} ${exactDate.length} exact ${exactDate.length == 1 ? 'match' : 'matches'} for`, `${dates.length == 1 ? dates[0] : dates.join(" and ")}`, "", "exactDate", isHidden); isHidden = true;}
			} 

			// Print Potential Match
			if (isPotentialMatch) {printPersonResult(potentialMatch, `There ${potentialMatch.length == 1 ? 'is' : 'are'} ${potentialMatch.length} potential ${potentialMatch.length == 1 ? 'match' : 'matches'} for`, original_fName, original_lName, "potentialMatch", isHidden); isHidden = true;} 

			// Print fName Matches
			if (isFNameMatch) {printPersonResult(fNameMatch, `There ${fNameMatch.length == 1 ? 'is' : 'are'} ${fNameMatch.length} ${fNameMatch.length == 1 ? 'match' : 'matches'} for the first name`, original_fName, "", "firstNameMatch", isHidden); isHidden = true;}

			// Print lName Matches
			if (isLNameMatch) {printPersonResult(lNameMatch, `There ${lNameMatch.length == 1 ? 'is' : 'are'} ${lNameMatch.length} ${lNameMatch.length == 1 ? 'match' : 'matches'} for the last name`, "", original_lName, "lastNameMatch", isHidden); isHidden = true;}

			// Print Date of Birth Matches
			if (isDoBMatch) { printPersonResult(dobMatch, `There ${dobMatch.length == 1 ? 'is' : 'are'} ${dobMatch.length} ${dobMatch.length == 1 ? 'match' : 'matches'} for the birth date of`, dobString, "", "dobMatch", isHidden); isHidden = true;}

			// Print Date of Death Matches
			if (isDoDMatch) {printPersonResult(dodMatch, `There ${dodMatch.length == 1 ? 'is' : 'are'} ${dodMatch.length} ${dodMatch.length == 1 ? 'match' : 'matches'} for the death date of`, dodString, "", "dodMatch", isHidden); isHidden = true;}

		});
	}

	

	function printPersonResult(results, messageTitle, fName = fName_input, lName = lName_input, id = 'defautlResult', hidden = false) {

		//  TODO: Sort results, and display the people
		var displayPerson = false
		var displayName = ""

		var divResultID = $(`#results #${id}`)

		if (fName != "" || lName != "") {
			displayPerson = true

			if (fName != "" && lName != "") {
				displayName = `${fName} ${lName}`
			} else {
				displayName = fName != "" ? fName : lName;
			}
		}


		if (displayPerson != "" && displayName != "") {

			if (results.length != 0) {
				$results.append(`<h1 class='resultMessage'>${messageTitle}:<br> <span>${displayName}</h1>`);
				$results.append(`<div class="results" id="${id}"></div>`)
			} else {
				$results.append(`<h1 class='errorMessage'>Sorry we couldn't find a match for: <span>${displayName}</h1>`);
			}

			for (var d in results) {
				displayPeople(results[d], id, hidden);
			}

		}

	}

	function displayPeople(d, id = '', hidden = false) {

		var cemetery = d['cemetery']
		var blockNum = d['blockNum']
		var lotNum = d['lotNum']
		var graveNum = d['graveNum']
		var graveSubNum = d['graveSubNum']


		var fName = d["fName"]
		var mName = d["mName"]
		var lName = d["lName"]
		var maidenName = d["maidenName"]
		var otherInfo = d["otherInfo"]

		var findAGraveLink = d["graveLink"]

		var dateOfBirth = getDate(d["dateOfBirth"])
		var dateOfDeath = getDate(d["dateOfDeath"])
		var burialDate = getDate(d["burialDate"])

		var cemeteryLocation = cemetery.substring(0, 4)

		var fName_clean = cleanString(fName)
		var lName_clean = cleanString(lName)

		var profileImage = d["profilePicture"]
		var obituaryImages = d["obituary"]
		var gravestoneImages = d["gravePictures"]
		var warsArray = d["wars"]

		if (profileImage == "") {
			profileImage = "images/unknown.png"
		}

		


		$(`#results #${id}`).last().append(`
			<div id="${fName_clean}${lName_clean}" class="result">
				<img src="${profileImage}" class="profilePicture" onclick="window.open(this.src, '_blank');" loading="lazy"></img>
				<h1><span class='fullName'>${fName} ${lName}</span><br>(${dateOfBirth.year} - ${dateOfDeath.year})</h1>
				<h3>${cemeteryLocation} Lawn - <span>Block ${blockNum}, Lot ${lotNum} : Grave ${graveNum}${graveSubNum}</span></h3>
				
				<a href='mailto:
					?subject=Augusta ${cemeteryLocation} Lawn Cemetery: ${fName} ${lName}
					&body=AUGUSTA CEMETERY ASSOCIATION - INFORMATION REQUEST:
					%0d%0a%0d%0aHere is the information we have on record for ${fName} ${lName}, located in the ${cemeteryLocation} Lawn Cemetery in Block ${blockNum}, Lot ${lotNum} [${graveNum}${graveSubNum}]%0d%0a
					%0d%0aFirst Name: ${fName}
					%0d%0aMiddle Name: ${mName}
					%0d%0aLast Name: ${lName}
					%0d%0aMaiden Name: ${maidenName} 
					%0d%0aDate of Birth: ${getDate_string(dateOfBirth)}
					%0d%0aDate of Death: ${getDate_string(dateOfDeath)}
					%0d%0aEstimated Age: ${yearDiff(d['dateOfBirth'], d['dateOfDeath'])}
					%0d%0aFindAGrave Link: ${findAGraveLink}
					%0d%0aWars / Service: ${warsArray}
					%0d%0a%0d%0a
					For more information, please visit the Augusta Cemetery Website located at https://www.augustawicemeteries.com%0d%0a
					Or to view the Augusta Cemetery Maps, please visit https://www.augustawicemeteries.com/cemeteryMaps.html
				' class='emailInfo'>Email Information</a>

				<div class="moreDetails">
					<h2 class="moreDetailsButton">More Details</h2>
				</div>

				<div class="details"></div>
				
			</div>
		`);


		var latestPerson = $(`#results div`).last()

		appendDetail_Text(latestPerson, "First Name", fName);
		appendDetail_Text(latestPerson, "Middle Name", mName);
		appendDetail_Text(latestPerson, "Last Name", lName);
		appendDetail_Text(latestPerson, "Maiden Name", maidenName);
		appendDetail_Text(latestPerson, "Other Info / Nickname", otherInfo);
		appendDetail_Link(latestPerson, "Find A Grave Link", `${fName} ${lName}`, findAGraveLink);
		appendDetail_Text(latestPerson, "Date of Birth", getDate_string(dateOfBirth));
		appendDetail_Text(latestPerson, "Date of Death", getDate_string(dateOfDeath));
		appendDetail_Text(latestPerson, "Estimated Age", yearDiff(d['dateOfBirth'], d['dateOfDeath']));
		appendDetail_TextArray(latestPerson, "Wars / Service", warsArray);
		appendDetail_Images(latestPerson, "Gravestone Photos", gravestoneImages, "gravestone");
		appendDetail_Images(latestPerson, "Obituary", obituaryImages, "obituary");

		if (hidden) {
			$(`#results #${id}`).css("display", "none")
		}

	}


	//
	// APPEND FUNCTNIONS
	//  

	function appendDetail_Text(div, title, info) {
		if (info != "") {
			div.append(`<h3>${title}: <span>${info}</span></h3>`);
		}
	}

	function appendDetail_TextArray(div, title, infoArray) {
		if (infoArray.length != 0 && title != "") {
			div.append(`<h3>${title}: <span>${infoArray.join(", ")}</span></h3>`);
		}
	}

	function appendDetail_Link(div, title, info, link = "") {
		if (info != "" && link != "") {
			div.append(`<h3>${title}: <span><a href="${link}" target="_blank">${info}</a></span></h3>`);
		}
	}

	function appendDetail_Images(div, title = "Images: ", imagesArray, addClass = "") {

		if (title != "" && imagesArray.length != 0) {
			div.append(`<h3>${title}:</h3>`)

			if (typeof imagesArray == "string") {
				div.append(`<img src="${imagesArray.replace("https", "http")}" class="${addClass}" onclick="window.open(this.src, '_blank');" loading="lazy">`);
			} else if (Array.isArray(imagesArray) && imagesArray.length != 0) {
				for (const i in imagesArray) {
					div.append(`<img src="${imagesArray[i].replace("https", "http")}" class="${addClass}" onclick="window.open(this.src, '_blank');" loading="lazy">`);
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

		// Filter Name Info
		let fNameInput = filterInput(values['fName_input'], ["numbers", "scripts", "special", "extraSpaces"])
		let lNameInput = filterInput(values["lName_input"], ["numbers", "scripts", "special", "extraSpaces"])


		// Filter Date Info
		let dobInput = filterInput(values['dob_input'], ['scripts','date'])
		let dodInput = filterInput(values['dod_input'], ['scripts','date'])


		// Display filtered input back into the form
		$("#fName_input:text").val(fNameInput);
		$("#lName_input:text").val(lNameInput);
		$("#dob_input:text").val(dobInput);
		$("#dod_input:text").val(dodInput);

		// Check if input boxes are empty or not
		if ((fNameInput == "" && lNameInput == "") && (dobInput == "" && dodInput == "")) {
			$(this).closest('form').find("input[type=text], textarea").val("");
			$results.append("<h1 class='errorMessage'>Invalid Input: Please enter a valid first or last name, or date.</h1>");
		} else {
			getMatches(fNameInput, lNameInput, sortOption, dobInput, dodInput)
		}
	});
});

$(document).on('click', '.moreDetails', function () {

	var message = $(this).text().trim();

	if (message == "More Details") {
		$(this).html("<h2>Less Details</h2>");
	} else {
		$(this).html("<h2>More Details</h2>")
	}

	$(this).next().toggle(400, "swing");
});

$(document).on('click', '.resultMessage', function () {
	$(this).next(".results").toggle(400, "swing")
});


// when image is loading, fade in
$(document).on('load', 'img', function () {
	$(this).fadeIn(1000);
});