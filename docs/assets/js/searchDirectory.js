function serialize() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const key = Array(10).fill('').map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return key;
}

function arrWordFilter(words, filterWords) {
    var filteredArr = [];

    words.forEach(word => {
        if (!filterWords.includes(word) && word.length > 1) {
            filteredArr.push(word);
        }
    });

    if (filteredArr.length == 0) {
        filteredArr = [""];
    }

    return filteredArr;
}

function cleanString(s) {
    return s.replace(/[^a-zA-Z ]/g, "");
}

function filterInput(input, filterType) {
    for (const f in filterType) {
        switch (filterType[f]) {
            case "alphabet":
                input = input.replace(/[a-zA-Z]/g, "");
                break;
            case "numbers":
                input = input.replace(/[0-9]/g, "");
                break;
            case "scripts": 
                input = input.replace(/((?=\<)(.*?)(?=\>)|(?=\>)(.*?)(?=\<))|[/</>]/g, "");
                break;
            case "special":
                input = input.replace(/[^a-zA-Z0-9 ]/g, "");
                break;
            case "spaces":
                input = input.replace(/[\s]/g, "");
                break;
            case "date":
                input = input.replace(/([^0-9-])/g, "");
                break;
            case "extraSpaces":
                input = input.replace(/[ ]{2,}/g, "");
                break;
        }
    }

    return input;
}

function getDate(dateStr) {
    function replaceDashes(str) {
        if (str.includes('--')) {
            return str.replace(/--/g, '-');
        } else {
            return str;
        }
    }

    dateStr = replaceDashes(dateStr);

    var d = {};
    dateArray = [];

    function nan(a) {
        if (Number.isNaN(a)) { return "Unknown"; } else { return a; }
    }

    if (typeof(dateStr) == "string") {
        if (dateStr.includes("-")) { dateArray = dateStr.split("-"); } else { dateArray[0] = dateStr; }
    }

    var dateLen = dateArray.length;

    switch (dateLen) {
        case 3:
            d.year = parseInt(dateArray[2]);
            d.month = parseInt(dateArray[0]);
            d.day = parseInt(dateArray[1]);

            d.year = nan(d.year);
            d.month = nan(d.month);
            d.day = nan(d.day);
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

    return d;
}

function yearDiff(dob, dod) {
    var dobDate = getDate(dob);
    var dodDate = getDate(dod);

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
    
    if (dodMonth < dobMonth) { if (yearDiff == 1) { return 0; } else { return yearDiff - 1; } }
    if (dodMonth >= dobMonth) { 
        if (dobDay == undefined || dodDay == undefined) { return yearDiff; } 
        if (dobMonth == dodMonth && dodDay < dobDay) { return yearDiff - 1; } else { return yearDiff; } 
    }
}

function getYear(dateStr) {
    var dateObj = getDate(dateStr);
    return dateObj['year'];
}


// INIT

const records = new Map();
const allNamesMap = new Map();

const lotIDs = new Map();

const firstNames = new Map();
const middleNames = new Map();
const lastNames = new Map();
const maidenNames = new Map();
const otherInfoNames = new Map();
const plotOwnerNames = new Map();
const yearsMap = new Map();

$().ready(function () {

    var cemeteryData = null;

    function combineNameMaps() {
        let nameMaps = [firstNames, middleNames, lastNames, maidenNames, otherInfoNames, plotOwnerNames];

        for (mapID in nameMaps) {
            let map = nameMaps[mapID];

            map.forEach((ids, name, map) => {
                if (!allNamesMap.has(name)) { allNamesMap.set(name, []); }

                ids.forEach(id => {
                    let mapKeys = allNamesMap.get(name);
                    if (!mapKeys.includes(id)) { mapKeys.push(id); }
                });
            });
        }
    }

    function serializeData(data) {
        cemeteryData = data; 

        for (cemetery in data) {
            for (blockNum in data[cemetery]) {
                for (lotNum in data[cemetery][blockNum]) {

                    do {
                        lotID = serialize();
                    } while (lotIDs.has(lotID));

                    let lotRecordIDs = [];

                    for (graveNum in data[cemetery][blockNum][lotNum]) {
                        for (g in data[cemetery][blockNum][lotNum][graveNum]) {

                            let d = data[cemetery][blockNum][lotNum][graveNum][g];

                            do {
                                recordID = serialize();
                            } while (records.has(recordID));

                            lotRecordIDs.push(recordID);

                            let isInfant = false;
                            let infantFilterWords = ["infant", "baby"];

                            if (infantFilterWords.some(word => d['otherInfo'].toLowerCase().includes(word))) { isInfant = true; }

                            let fullName = d["maidenName"] != "" ? `${d["fName"]} ${d["mName"]} <i>${d["maidenName"]}</i> ${d["lName"]}` : `${d["fName"]} ${d["mName"]} ${d["lName"]}`;

                            if (d["graveLink"] != "") { 
                                fullName = `<a href="${d["graveLink"]}" target="_blank">${fullName}</a>`;
                            }

                            let burialYear = getYear(d["burialDate"]).toString();
                            if (burialYear == "Unknown" || burialYear.length != 4) { burialYear = "Unknown"; }

                            let deathYear = getYear(d["dateOfDeath"]).toString();
                            if (deathYear == "Unknown" || deathYear.length != 4) { deathYear = "Unknown"; }

                            record = {
                                "firstName": d["fName"],
                                "middleName": d["mName"],
                                "lastName": d["lName"],
                                "maidenName": d["maidenName"],
                                "fullName": fullName,
                                "nickname": d["otherInfo"],
                                "dateOfBirth": d["dateOfBirth"],
                                "birthYear": getYear(d["dateOfBirth"]),
                                "deathYear": deathYear,
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
                                "graveLink": d["graveLink"],
                                "isVeteran": d["isVeteran"]
                            };

                            let otherInfoArr = filterInput(record.nickname.toLowerCase(), ["special"]).split(" ");
                            let otherInfoFilterWords = ["", "infant", "infants", "child", "baby", "son", "sons", "daughter", "daughters", "of", "not", "available", "twin", "twins", "and", "mr", "mrs", "jr", "rev"];

                            nickNameWordsRemove = ["us", "army", "veteran", "infantry", "available", "buried", "tree", "killed"];
                            nickNameWordsRemove.forEach(word => {
                                if (otherInfoArr.includes(word)) {
                                    otherInfoArr = [""];
                                }
                            });

                            if (otherInfoArr.length > 1 && otherInfoArr[0] != "") {
                                otherInfoArr = arrWordFilter(otherInfoArr, otherInfoFilterWords);
                                
                                if (otherInfoArr.length >= 1) {
                                    otherInfoArr.forEach(name => {
                                        if (name == "") { return; }
                                        if (!otherInfoNames.has(name.toLowerCase())) {
                                            otherInfoNames.set(name.toLowerCase(), []);
                                        }

                                        otherInfoNames.get(name.toLowerCase()).push(recordID);
                                    });
                                }
                            }

                            let plotOwners = record.plotOwner.split(" ");
                            let filteredPlotOwners = [];
                            
                            plotOwners.forEach(name => {
                                name = filterInput(name.toLowerCase(), ["special", "numbers"]);
                                let filteredWords = ["and", "tree", "road", "mr", "mrs", "sr", "jr", "rev", "dr", "of", "not", "available", "for"];
                                if (name != "" && name.length > 1 && !filteredWords.includes(name)) {
                                    filteredPlotOwners.push(name);

                                    if (!plotOwnerNames.has(name.toLowerCase())) {
                                        plotOwnerNames.set(name.toLowerCase(), []);
                                    }

                                    plotOwnerNames.get(name.toLowerCase()).push(recordID);
                                }
                            });

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

                            records.set(recordID, record);

                            firstNames.get(record.firstName.toLowerCase()).push(recordID);
                            middleNames.get(record.middleName.toLowerCase()).push(recordID);
                            lastNames.get(record.lastName.toLowerCase()).push(recordID);
                            if (record.maidenName != "") {
                                maidenNames.get(record.maidenName.toLowerCase()).push(recordID);
                            }

                            [record.burialYear.toString(), record.deathYear.toString()].forEach(yr => {
                                if (yr !== "Unknown" && yr.length === 4) {
                                    if (!yearsMap.has(yr)) {
                                        yearsMap.set(yr, []);
                                    }
                                    if (!yearsMap.get(yr).includes(recordID)) {
                                        yearsMap.get(yr).push(recordID);
                                    }
                                }
                            });

                        }
                    }

                    lotIDs.set(lotID, {
                        "recordIDs": lotRecordIDs,
                        "Block": blockNum,
                        "Lot": lotNum,
                        "Cemetery": cemetery.replace("Lawn", ""),
                    });

                }
            }
        }

        combineNameMaps();
    }

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://directory-data.augustacemeteryassociation.workers.dev/',
        async: false,
        success: async function (data) { 
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
                    serializeData(data);
                }
            });
        }
    });

    var $results = $("#directoryResults");

    function getMatches(locationInput, blockInput, lotInput, nameInput, burialYear, nameSortInput) {

        let hasSearchParameters = (
            (locationInput && locationInput !== "any") ||
            blockInput !== "" ||
            lotInput !== "" ||
            nameInput !== "" ||
            (burialYear !== "" && burialYear.length === 4)
        );

        if (!hasSearchParameters) {
            $results.empty();
            $results.append(`
                <h1 class="errorMessage">
                    Please enter a Block #, Lot #, Name, or Year to search.
                </h1>
            `);
            return;
        }

        var matches = [];
        var yearMatches = [];
        var lotMatches = [];

        if (burialYear != "" && burialYear.length == 4) { 
            yearMatches = yearsMap.get(burialYear) || [];
        }

        let titleText = "Cemetery Directory";

        if (locationInput != "any") {
            titleText += ` - ${locationInput.charAt(0).toUpperCase() + locationInput.slice(1)} Lawn`;
        }

        if (blockInput != "") {
            titleText += ` - Block ${blockInput}`;
        }

        if (lotInput != "") {
            titleText += ` - Lot ${lotInput}`;
        }

        if (burialYear != "" && nameInput == "") {
            titleText += ` [${burialYear}]`;
        }

        if (nameInput != "") {

            let nameInputs = filterInput(nameInput, ["special", "numbers"]).toLowerCase().split(" ").filter(name => name !== "");

            if (nameInputs.length > 0) {
                titleText += ` : ${nameInputs.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ")}`;
            }

            if (burialYear != "") {
                titleText += ` [${burialYear}]`;
            }
            
            let termMatchMaps = [];

            nameInputs.forEach(nameIn => {
                let idsForTerm = new Set();

                allNamesMap.forEach((ids, name) => {
                    let isMatch = false;

                    if (nameSortInput === "exact") {
                        isMatch = (name === nameIn);
                    } else {
                        isMatch = name.includes(nameIn);
                    }

                    if (isMatch) {
                        ids.forEach(id => idsForTerm.add(id));
                    }
                });

                termMatchMaps.push(idsForTerm);
            });

            if (nameSortInput === "exact") {
                if (termMatchMaps.length > 0) {
                    let firstSet = termMatchMaps[0];
                    matches = Array.from(firstSet).filter(id => 
                        termMatchMaps.every(termSet => termSet.has(id))
                    );
                }
            } else {
                let combinedSet = new Set();
                termMatchMaps.forEach(termSet => {
                    termSet.forEach(id => combinedSet.add(id));
                });
                matches = Array.from(combinedSet);
            }

            // Filter matched names by Location, Block, and Lot criteria
            let filteredMatches = [];
            matches.forEach(id => {
                let record = records.get(id);
                if (!record) return;
                
                let lotID = record.lotID;
                let lotInfo = lotIDs.get(lotID);

                let isLocationMatch = (locationInput === "any" || locationInput === lotInfo.Cemetery.toLowerCase());
                let isBlockMatch = (blockInput === "" || blockInput === lotInfo.Block);
                let isLotMatch = (lotInput === "" || lotInput === lotInfo.Lot);

                if (isLocationMatch && isBlockMatch && isLotMatch) {
                    filteredMatches.push(id);
                    if (!lotMatches.includes(lotID)) {
                        lotMatches.push(lotID);
                    }
                }
            });

            // Retain only record IDs that passed location, block, and lot criteria
            matches = filteredMatches;
        }

        // Filter by year if year was provided
        if (burialYear != "" && burialYear.length == 4) {
            if (nameInput != "") {
                matches = matches.filter(id => yearMatches.includes(id));
                // Recalculate lotMatches based on filtered matches
                lotMatches = [...new Set(matches.map(id => records.get(id).lotID))];
            } else {
                matches = yearMatches;
            }
        }

        if (nameInput == "") {
            if (burialYear != "" && yearMatches.length > 0) {
                yearMatches.forEach(id => {
                    let record = records.get(id);
                    if (!record) return;

                    let lotID = record.lotID;
                    let lotInfo = lotIDs.get(lotID);

                    if (locationInput == "any" || locationInput == lotInfo.Cemetery.toLowerCase()) {
                        if (blockInput == "" && lotInput == "") { lotMatches.push(lotID); return; }
                        if ((blockInput != "" && blockInput == lotInfo.Block) && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
                        if (lotInput == "" && (blockInput != "" && blockInput == lotInfo.Block)) { lotMatches.push(lotID); return; }
                        if (blockInput == "" && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
                    }
                });
            } else {
                lotIDs.forEach((lot, lotID) => {
                    let lotInfo = lotIDs.get(lotID);

                    if (locationInput == "any" || locationInput == lotInfo.Cemetery.toLowerCase()) {
                        if (blockInput == "" && lotInput == "") { return; }
                        if ((blockInput != "" && blockInput == lotInfo.Block) && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
                        if (lotInput == "" && (blockInput != "" && blockInput == lotInfo.Block)) { lotMatches.push(lotID); return; }
                        if (blockInput == "" && (lotInput != "" && lotInput == lotInfo.Lot)) { lotMatches.push(lotID); return; }
                    }
                });
            }
        }

        // Check if no results were found matching ALL entered criteria
        if (lotMatches.length == 0 || (nameInput !== "" && matches.length == 0)) {
            $results.empty();
            $results.append(`
                <h1 class="errorMessage">
                    No Results Found
                </h1>
            `);
            return;
        }

        let orderedLots = [];

        lotIDs.forEach((lot, lotID) => {
            if (lotMatches.includes(lotID)) {
                orderedLots.push(lotID);
            }
        });

        $("title").html(titleText);
        $results.empty();

        if (cemeteryData == null) { return; }

        orderedLots.forEach(lotID => {

            let lotInfo = lotIDs.get(lotID);

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
            `);

            let $record = $(`div #LOT_${lotID}`);

            $record.append(`<table id="TABLE_${lotID}"></table>`);
            let $table = $(`table#TABLE_${lotID}`);
            
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
            `);

            let $tbody = $(`table#TABLE_${lotID} > tbody`);

            lotInfo.recordIDs.forEach(recID => {

                let record = records.get(recID);
                let isHighlighted = "";

                if (matches.includes(recID)) {
                    isHighlighted = "highlight";
                } 

                if (burialYear != "" && burialYear.length == 4) {
                    if (record.burialDate.includes(burialYear) || record.dateOfDeath.includes(burialYear)) {
                        if (nameInput === "" || matches.includes(recID)) {
                            isHighlighted = "highlight";
                        }
                    } else {
                        isHighlighted = "";
                    }
                }

                const vetBadge = record.isVeteran 
                    ? `<span class="vet-badge" title="Veteran">V</span>` 
                    : ``;

                $tbody.append(`
                    <tr class="${isHighlighted}">
                        <td class="graveNum">${record.graveNum}</td>
                        <td class="fullName">${vetBadge}${record.fullName}</td>
                        <td class="plotOwner">${record.plotOwner}</td>
                        <td class="burialDate">${record.burialDate}</td>
                    </tr>
                `);
            });
        });
    }

    $("select").change(function () {
        window.stop();
        $("#directoryResults").empty();
        var blockID = $(this).children("option:selected").val();
    });

    var initOption = $("select").children("option:selected").val();

    //
    // FORM SUBMISSION
    //

    $("form").submit(function () {

        var $results =$("#directoryResults");

        window.stop();
        $results.empty();
        var $inputs =$('form :input');
        var values = {};

        $inputs.each(function () {
            values[this.name] = $(this).val();
        });

        let locationInput = values['locationSelection'];
        let blockInput = filterInput(values['block_input'].charAt(0).toUpperCase(), ["scripts", "special", "extraSpaces"]);
        let lotInput = filterInput(values['lot_input'].toUpperCase(), ["scripts", "special", "extraSpaces"]);
        let nameInput = filterInput(values['name_input'], ["scripts", "special"]);
        let burialYear = filterInput(values['burialYear_input'], ["scripts", "alphabet", "special", "extraSpaces"]);

        if (burialYear.length > 4) { burialYear = burialYear.slice(0, 4); }

        let nameSortInput = values['nameSelection'];

        // Display filtered input back into the form
        $("#block_input:text").val(blockInput);
        $("#lot_input:text").val(lotInput);
        $("#name_input:text").val(nameInput);
        $("#burialYear_input:text").val(burialYear);

        getMatches(locationInput, blockInput, lotInput, nameInput, burialYear, nameSortInput);

    });
});