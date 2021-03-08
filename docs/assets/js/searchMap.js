function cleanString(s) {
    return s.replace(/[^a-zA-Z ]/g, "");
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
                printPersonRusult(exactMatch, `There is ${exactMatch.length} grave located in ${cemetery}, Block ${blockID} - Lot ${lotID}`, "exactMatch", false);
            } else {
                printPersonRusult(exactMatch, `There are ${exactMatch.length} graves located in ${cemetery}, Block ${blockID} - Lot ${lotID}`, "exactMatch", false);
            }
            
        } else if (lotID == "Blank"){
            $results.append(`<h1 class='resultMessage'>Sorry, the lot that you select is either empty or not available.`);
        } else {
            $results.append(`<h1 class='resultMessage'>Sorry, we couldn't find any graves at ${cemetery}, Block ${blockID} - Lot ${lotID}</h1>`);
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
            <div id="${fName_clean}${lName_clean}" class="imgFadeIn">
                <img src="${profileImage}" class="profilePicture"></img>
                <h1><span class='fullName'>${fName} ${lName}</span><br>(${dateOfBirth.year} - ${dateOfDeath.year})</h1>
                <h3>${cemetery} - Block ${blockNum}, Lot ${lotNum} : Grave ${graveNum}${graveSubNum}</h3>

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
            div.append(`<img src="${imagesArray.replace("https", "http")}" class="${addClass}">`);
        } else if (Array.isArray(imagesArray) && imagesArray.length != 0) {
            for (const i in imagesArray) {
                div.append(`<img src="${imagesArray[i].replace("https", "http")}" class="${addClass}">`);
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
