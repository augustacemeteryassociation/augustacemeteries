function cleanString(s) {
    return s.replace(/[^a-zA-Z ]/g, "");
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

    //        console.log(d1, d2)
    //        console.log(d1Arr, d2Arr)
    //        console.log(d2YearVal, d1YearVal)

    let d2Time = date2.getTime();
    let d1Time = date1.getTime();

    let timeYearDiff = Math.floor((d2Time - d1Time) / 31536000000);
    let yearDiff = Math.floor(d2YearVal - d1YearVal)


    if (isNaN(timeYearDiff)) {

        if (isNaN(yearDiff)) {
            yearDiff = "Unknown"
        } else if (yearDiff == 0) {
            yearDiff = "Less than 1 year"
        }

        //            console.log(`Death Date = ${date2},  Birth Date = ${date1}\nDeath YearTime = ${d2YearVal}, Birth YearTime = ${d1YearVal}\nYear Diff = ${yearDiff}`)
        return yearDiff

    }

    if (timeYearDiff == 0) {
        timeYearDiff = "Less than 1 year"
    }

    //        console.log(`Death Date = ${date2},  Birth Date = ${date1}\nDeath YearTime = ${d2Time}, Birth YearTime = ${d1Time}\nYear Diff = ${timeYearDiff}`)

    return timeYearDiff

}

function getDate(dateStr) {

    var d = {}
    dateArray = []

    function nan(a) {
        if (Number.isNaN(a)) {
            return "Unknown"
        } else {
            return a
        }
    }

    if (dateStr.includes("-")) {
        dateArray = dateStr.split("-")
    } else {
        dateArray[0] = dateStr
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

            d.year = nan(d.year)
            d.month = nan(d.month)

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

function getDate_string(dateObject) {

    var year = dateObject.year
    var month = dateObject.month
    var day = dateObject.day

    if (year != undefined) {

        if (month != undefined) {

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


            if (day != undefined) {
                return `${monthStr} ${day}, ${year}`;
            } else {
                return `${monthStr} ${year}`;
            }

        } else {
            return `${year}`
        }

    } else {
        return "Unknown"
    }

}



var $results = $("#results")

function searchMap(cemetery, blockID, lotID) {

    $results.empty();

    $.getJSON("json/graves.json", function (data) {

        var count = 0;
        var exactMatch = []
        for (c in data) {

            $("results").append(c);

            for (blockNum in data[c]) {
                for (lotNum in data[c][blockNum]) {
                    for (graveNum in data[c][blockNum][lotNum]) {
                        for (g in data[c][blockNum][lotNum][graveNum]) {
                            var d = data[c][blockNum][lotNum][graveNum][g]


                            if (c == cemetery) {
                                if (blockID == blockNum) {
                                    if (lotNum == lotID) {
                                        d["cemetery"] = cemetery
                                        d['blockNum'] = blockNum
                                        d['lotNum'] = lotNum
                                        d['graveNum'] = graveNum
                                        d['graveSubNum'] = g

                                        if (d['fName'] != "" && d['lName'] != "") {
                                            exactMatch.push(d)
                                        }
                                        
                                        // DEBUGGER FOR INVALID AGE (NEGATIVE AGE NUMBER)
                                        
                                        // var estimatedAge = yearDiff(d['dateOfBirth'], d['dateOfDeath'])
                                        // if (estimatedAge < 0) {
                                        //    console.log(`Age Error @ ${cemetery} - Block ${blockNum}, Lot ${lotNum} - ${graveNum+g}`, d)
                                        // }

                                    }
                                }
                            }
                        }
                    }
                }
            }


        }



        var isExactMatch_length = exactMatch.length
        var isExactMatch = isExactMatch_length >= 1




        if (isExactMatch) {

            if (isExactMatch_length == 1) {
                printPersonRusult(exactMatch, `There is ${exactMatch.length} grave located in:<br> <span>${cemetery.substr(0, 4) + " " + cemetery.substr(4, cemetery.length)}, Block ${blockID} - Lot ${lotID}</span>`, "exactMatch", false);
            } else {
                printPersonRusult(exactMatch, `There are ${exactMatch.length} graves located in:<br> <span>${cemetery.substr(0, 4) + " " + cemetery.substr(4, cemetery.length)}, Block ${blockID} - Lot ${lotID}</span>`, "exactMatch", false);
            }

        } else if (lotID == "Blank") {
            $results.append(`<h1 class='resultMessage'>Sorry, the lot that you selected is either empty or not available.`);
        } else {
            $results.append(`<h1 class='resultMessage'>Sorry, we couldn't find any graves at <span>${cemetery.substr(0, 4) + " " + cemetery.substr(4, cemetery.length)}, Block ${blockID} - Lot ${lotID}</span></h1>`);
        }

        $results.append(`<h1 class='toTop'>Go Back to Top of Page</h1>`);

    });
}

function printPersonRusult(results, messageTitle, id = 'defautlResult', hidden = false) {

    //  TODO: Sort results, and display the people
    var displayPerson = false
    var displayName = ""

    var divResultID = $(`#results #${id}`)



    $results.append(`<h1 class='resultMessage'>${messageTitle}</h1>`);
    $results.append(`<div class="results" id="${id}"></div>`)



    for (var d in results) {
        //        console.log(results[d])
        displayPeople(results[d], id, hidden);
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

    var cemeteryLocation = cemetery.substr(0, 4)

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
                <img src="${profileImage}" class="profilePicture imgFade" onclick="window.open(this.src, '_blank');" loading="lazy"></img>
                <h1><span class='fullName'>${fName} ${lName}</span><br>(${dateOfBirth.year} - ${dateOfDeath.year})</h1>
                <h3 class="location">${cemeteryLocation} Lawn - <span>Block ${blockNum}, Lot ${lotNum} : Grave ${graveNum}${graveSubNum}</span></h3>
                
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
    //    console.log("clicked")
    $(this).next(".results").toggle(400, "swing")
});

// when image is loading, fade in
// $(document).on('load', 'img', function () {
//     $(this).fadeIn(1000);
// });