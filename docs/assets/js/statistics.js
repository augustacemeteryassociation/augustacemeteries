function serialize() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const key = Array(10).fill('').map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return key
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


$().ready(function () {

    const records = new Map()
    const dobYears = new Map()
    const dodYears = new Map()
    const cemeteryMap = new Map()


	$.getJSON("json/graves.json", function (data) {

        $("input#yearInterval").val(5);
        

        //
        // CEMETERY SEARCH
        //

        for (cemetery in data) {

            for (blockNum in data[cemetery]) {
                for (lotNum in data[cemetery][blockNum]) {
                    for (graveNum in data[cemetery][blockNum][lotNum]) {
                        for (g in data[cemetery][blockNum][lotNum][graveNum]) {

                            let d = data[cemetery][blockNum][lotNum][graveNum][g]

                            // If record is blank or invalid, skip
                            if (d['fName'] == "" && d['lName'] == "") { continue }

                            record = {
                                "firstName": d["fName"],
                                "middleName": d["mName"],
                                "lastName": d["lName"],
                                "maidenName": d["maidenName"],
                                "dateOfBirth": d["dateOfBirth"],
                                "birthYear": getYear(d["dateOfBirth"]),
                                "deathYear": getYear(d["dateOfDeath"]),
                                "dateOfDeath": d["dateOfDeath"],
                                "estimatedAge": yearDiff(d['dateOfBirth'], d['dateOfDeath']),
                                "cemetery": cemetery.replace("Lawn", ""),
                                "blockNum": blockNum,
                                "lotNum": lotNum,
                                "graveNum": `${graveNum}${g}`,
                            }
                            

                            // Get new unique record ID
                            do {
                                recordID = serialize();
                            } while (records.has(recordID))

                            // Set record key
                            records.set(recordID, record)

                            if (record["estimatedAge"] != "Unknown") {


                                // If birth year has not been set, set it
                                if (!dobYears.has(record['birthYear'])) {
                                    dobYears.set(record['birthYear'], [])
                                }

                                dobYears.get(record['birthYear']).push(recordID)


                                // If death year has not been set, set it
                                if (!dodYears.has(record['deathYear'])) {
                                    dodYears.set(record['deathYear'], [])
                                }

                                dodYears.get(record['deathYear']).push(recordID)

                                if (!cemeteryMap.has("All")) {
                                    cemeteryMap.set("All", [])
                                }

                                if (!cemeteryMap.has(record['cemetery'])) {
                                    cemeteryMap.set(record['cemetery'], [])
                                }

                                cemeteryMap.get(record['cemetery']).push(recordID)
                                cemeteryMap.get("All").push(recordID)
                            }

                            // const retrievedRecord = JSON.parse(records.get(recordID));
                            // console.log(retrievedRecord); 

                        }
                    }
                }
            }
        }
    }).then(() => {
        // console.log(records)
        // console.log(dobYears)
        // console.log(dodYears)
        // console.log(cemeteryMap)
        dobArr = []
        dodArr = []

        for (const key of dobYears.keys()) {
            dobArr.push(key);
        }

        for (const key of dodYears.keys()) {
            dodArr.push(key);
        }

        dobArr.sort()
        dodArr.sort()

        let minDodYear = dodArr[0]

        do {
            minDodYear = minDodYear - 1
        } while (minDodYear % 5 != 0);

        dodYearRange = new Map()

        do {
            // console.log(`${minDodYear} - ${minDodYear + 4}`)

            let matchedYears = []

            for (i=minDodYear; i <= minDodYear + 4; i++) {
                matchedYears = matchedYears.concat(dodYears.get(i))
            }

            dodYearRange.set(`${minDodYear} - ${minDodYear + 4}`, matchedYears)
            // console.log(matchedYears)

            minDodYear += 5
        } while (minDodYear <= new Date().getFullYear());

        for (const key of dodYearRange.keys()) {
            // console.log(key)
            data = dodYearRange.get(key)
            ages = []

            for (const ele of data) {

                if (records.has(ele)) {
                    const record = records.get(ele);
                    ages.push(record.estimatedAge);
                }
            }

            years = key.split(" - ")
            if (years[0] == years[1]) {
                years = years[0]
            } else {
                years = key
            }

            ages = ages.sort((a, b) => a - b);
            // console.log(ages)
            min = ages[0];
            max = ages[ages.length - 1];   
            average = ages.reduce((a, b) => a + b, 0) / ages.length;
            median = ages[Math.floor(ages.length / 2)];

            // console.log(`Min: ${min}, Max: ${max}, Avg: ${average}, Median: ${median}`)

            if(ages.length != 0) {
                $("#tableRecords").append(`
                    <tr>
                        <td>${years}</td>
                        <td>${ages.length}</td>
                        <td>${min}</td>
                        <td>${average.toFixed(2)}</td>
                        <td>${median}</td>
                        <td>${max}</td>
                    </tr>`);
            }
            


        }
        

        
    });



    function generateTable_interval(interval, cemeteryType, yearType) {

        try{

            dobArr = []
            dodArr = []
            // console.log(cemeteryMap)
            for (const key of dobYears.keys()) {
                dobArr.push(key);
            }

            for (const key of dodYears.keys()) {
                dodArr.push(key);
            }

            dobArr.sort()
            dodArr.sort()

            // console.log(dobArr)
            // console.log(dodArr)

            let minDodYear = dodArr[0]
            let minDobYear = dobArr[0]

            // console.log(yearType)

            if (yearType == "birthYears") {
                minYear = minDobYear
                // console.log(minDobYear)
            } else if (yearType == "deathYears") {
                minYear = minDodYear
                // console.log(minDodYear)
            }

            do {
                minYear = minYear - 1
                // console.log(minYear)
            } while (minYear % 5 != 0);

            dodYearRange = new Map()

            do {
                // console.log(`${minDodYear} - ${minDodYear + 4}`)

                let matchedYears = []

                for (i=minYear; i <= minYear + interval - 1; i++) {
                    if (yearType == "birthYears") {
                        matchedYears = matchedYears.concat(dobYears.get(i))
                    } else if (yearType == "deathYears") {
                        matchedYears = matchedYears.concat(dodYears.get(i))
                    }
                    
                }

                if ((cemeteryType == "West") || (cemeteryType == "East")) {
                    matchedYears = matchedYears.filter(v => cemeteryMap.get(cemeteryType).includes(v))
                }
                // console.log(matchedYears)

                dodYearRange.set(`${minYear} - ${minYear + interval-1}`, matchedYears)
                // console.log(matchedYears)

                minYear += interval
            } while (minYear <= new Date().getFullYear());

            

            for (const key of dodYearRange.keys()) {
                // console.log(key)
                // console.log(key)
                data = dodYearRange.get(key)
                ages = []

                for (const ele of data) {

                    if (records.has(ele)) {
                        const record = records.get(ele);
                        ages.push(record.estimatedAge);
                    }
                }

                years = key.split(" - ")
                if (years[0] == years[1]) {
                    years = years[0]
                } else {
                    years = key
                }

                ages = ages.sort((a, b) => a - b);
                min = ages[0];
                max = ages[ages.length - 1];   
                average = ages.reduce((a, b) => a + b, 0) / ages.length;
                median = ages[Math.floor(ages.length / 2)];


                // console.log(`Min: ${min}, Max: ${max}, Avg: ${average}, Median: ${median}`)
                if(ages.length != 0) {
                    $("#tableRecords").append(`
                        <tr>
                            <td>${years}</td>
                            <td>${ages.length}</td>
                            <td>${min}</td>
                            <td>${average.toFixed(2)}</td>
                            <td>${median}</td>
                            <td>${max}</td>
                        </tr>`);
                }
                


            }
        }
        catch(e) {
            console.log(e)
        }
    }


    function generateTable_customRange(yearMin, yearMax, cemeteryType, yearType) {

        try{

            dobArr = []
            dodArr = []
            // // console.log(cemeteryMap)
            for (const key of dobYears.keys()) {
                dobArr.push(key);
            }

            for (const key of dodYears.keys()) {
                dodArr.push(key);
            }

            dobArr.sort()
            dodArr.sort()

            // // console.log(dobArr)
            // // console.log(dodArr)

            // let minDodYear = dodArr[0]
            // let minDobYear = dobArr[0]

            // // console.log(yearType)

            // if (yearType == "birthYears") {
            //     minYear = minDobYear
            //     console.log(minDobYear)
            // } else if (yearType == "deathYears") {
            //     minYear = minDodYear
            //     console.log(minDodYear)
            // }

            // do {
            //     minYear = minYear - 1
            //     // console.log(minYear)
            // } while (minYear % 5 != 0);

            dodYearRange = new Map()

            // do {
                // console.log(`${minDodYear} - ${minDodYear + 4}`)

            let matchedYears = []

            for (i=yearMin; i <= yearMax - 1; i++) {
                if (yearType == "birthYears") {
                    matchedYears = matchedYears.concat(dobYears.get(i))
                } else if (yearType == "deathYears") {
                    matchedYears = matchedYears.concat(dodYears.get(i))
                }
                
            }
            // console.log(matchedYears)

            if ((cemeteryType == "West") || (cemeteryType == "East")) {
                matchedYears = matchedYears.filter(v => cemeteryMap.get(cemeteryType).includes(v))
            }
            // console.log(matchedYears)

            dodYearRange.set(`${yearMin} - ${yearMax}`, matchedYears)
                // console.log(matchedYears)

            //     minYear += interval
            // } while (minYear <= new Date().getFullYear());

            

            for (const key of dodYearRange.keys()) {
                // console.log(key)
                // console.log(key)
                data = dodYearRange.get(key)
                ages = []

                for (const ele of data) {

                    if (records.has(ele)) {
                        const record = records.get(ele);
                        ages.push(record.estimatedAge);
                    }
                }

                years = key.split(" - ")
                if (years[0] == years[1]) {
                    years = years[0]
                } else {
                    years = key
                }

                ages = ages.sort((a, b) => a - b);
                min = ages[0];
                max = ages[ages.length - 1];   
                average = ages.reduce((a, b) => a + b, 0) / ages.length;
                median = ages[Math.floor(ages.length / 2)];


                // console.log(`Min: ${min}, Max: ${max}, Avg: ${average}, Median: ${median}`)
                if(ages.length != 0) {
                    $("#tableRecords").append(`
                        <tr>
                            <td>${years}</td>
                            <td>${ages.length}</td>
                            <td>${min}</td>
                            <td>${average.toFixed(2)}</td>
                            <td>${median}</td>
                            <td>${max}</td>
                        </tr>`);
                }
                


            }
        }
        catch(e) {
            console.log(e)
        }
    }


    

    $("div#yearOption").on('change input', function() {
        updateTable();
    });

    $("#cemeteryType").change(function() {
        updateTable();
    });

    $("#yearType_input").change(function() {
        // var yearType = $("select#yearType").val();
        // console.log(yearType)
        updateTable();
    })

    $("div#yearSearchType").change(function() {
        var yearSearchType = $("select#yearSearchType").val();
        // console.log(yearSearchType)
        $("#yearOption").empty();

        if (yearSearchType == "interval") {
            $("#yearOption").append(`
                <h1>Year Interval</h1>
                <input type="input" id="yearInterval" class="intervalInput">
            `);
        } else if (yearSearchType == "custom") {
            $("#yearOption").append(`
                <h1>Custom Year Range</h1>
                <input type="input" id="minYear" class="minYear"> - <input type="input" id="maxYear" class="maxYear">
            `);
        }
    })

    $("div#cemetery_input").on('change input', function() {

        var cemetery = $("select#cemeteryType").val();
    });

    function updateTable() {


        var yearOption = $("select#yearSearchType").val();
        var cemeteryType = $("select#cemeteryType").val();
        var yearType = $("select#yearType").val();
        // console.log(yearOption)

        if (yearType == "birthYears") {
            $("table > thead > tr > th:first-child").text("Birth Year Range");
        } else {
            $("table > thead > tr > th:first-child").text("Death Year Range");
        }

        $("tableRecords").empty();

        if (yearOption == "interval") {
            var interval = parseInt($("input#yearInterval").val());

            if (interval != NaN  && (interval > 0 && interval <= 500)) {
                $("#tableRecords").empty();
                // console.log(interval)
                generateTable_interval(interval, cemeteryType, yearType);
            }
            
        } else if (yearOption == "custom") {

            $("#tableRecords").empty();
            var minYear = parseInt($("input#minYear").val());
            var maxYear = parseInt($("input#maxYear").val());

            generateTable_customRange(minYear, maxYear, cemeteryType, yearType);
        }
        
    }
    

    
});



