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
            d.year = nan(d.year)
            
            break;

        case '':
            d.year = "Unknown";
            break;
    }

    return d




    //            var dateArray = date.split("-")
    //            console.log(dateArray);

    //            console.log(d);

}

function getDate_string(dateObject) {

//    console.log(dateObject);
    
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
//            console.log(dateObject)
//            console.log(`${year}`)
            return `${year}`
        }

    } else {
        return "Unknown"
    }

}

$().ready(function () {

    var $results = $("#results")

    function getMatches(fName_input, lName_input, sortOption) {

        $results.empty();

        var original_fName = fName_input
        var original_lName = lName_input

        fName_input = fName_input.toLowerCase();
        lName_input = lName_input.toLowerCase();

        $.getJSON("json/graves.json", function (data) {

            var matches = []
            var exactMatch = []
            var fNameMatch = []
            var lNameMatch = []

            var fName_inputLower = fName_input.toLowerCase();
            var lName_inputLower = lName_input.toLowerCase();
            var count = 0;

            var compareObjects = function (a, b) {

                var fName_a = a.fName.toLowerCase();
                var fName_b = b.fName.toLowerCase();

                var lName_a = a.lName.toLowerCase();
                var lName_b = b.lName.toLowerCase();


                if (fName_a < fName_b) {
                    return -1
                }

                if (fName_a > fName_b) {
                    return 1
                }

                if (lName_a < lName_b) {
                    return -1;
                }

                if (lName_a > lName_b) {
                    return 1
                }

            }

            for (cemetery in data) {

                $("results").append(cemetery);

                for (blockNum in data[cemetery]) {
                    for (lotNum in data[cemetery][blockNum]) {
                        for (graveNum in data[cemetery][blockNum][lotNum]) {
                            for (g in data[cemetery][blockNum][lotNum][graveNum]) {
                                var d = data[cemetery][blockNum][lotNum][graveNum][g]

                                d['cemetery'] = cemetery
                                d['blockNum'] = blockNum
                                d['lotNum'] = lotNum
                                d['graveNum'] = graveNum
                                d['graveSubNum'] = g

                                var fName = d["fName"].toLowerCase()
                                var mName = d["mName"].toLowerCase()
                                var lName = d["lName"].toLowerCase()
                                var maidenName = d["maidenName"].toLowerCase()
                                var otherInfo = d["otherInfo"].toLowerCase()

                                // TODO[x]: Fix Result sorting system
                                // VALID FIRSTNAME
                                if (fName != "") {
                                    if (lName != "") {
                                        if (fName.includes(fName_input) || otherInfo.includes(fName_input)) {
                                            if (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower) && maidenName != "")) {
                                                exactMatch.push(d);
                                            } else {
                                                fNameMatch.push(d);
                                            }
                                        } else {
                                            if (lName.includes(lName_inputLower) || (maidenName.includes(lName_inputLower) && maidenName != "")) {
                                                lNameMatch.push(d)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (sortOption == "name") {
                exactMatch.sort(compareObjects);
                fNameMatch.sort(compareObjects);
                lNameMatch.sort(compareObjects);
            }


            var isExactMatch = exactMatch.length >= 1
            var isFNameMatch = fNameMatch.length >= 1
            var isLNameMatch = lNameMatch.length >= 1




//            console.log(fNameMatch);

            //TODO: Print RESULTS
            if (isExactMatch) {
                if (exactMatch.length > 1) {
                    printPersonRusult(exactMatch, "There are " + exactMatch.length + " exact matches for", original_fName, original_lName, "exactMatch", false)
                } else if (exactMatch.length == 1) {
                    printPersonRusult(exactMatch, "There is " + exactMatch.length + " exact match for", original_fName, original_lName, "exactMatch", false)
                }
            } else if (isFNameMatch == false && isLNameMatch == false) {
                $results.append(`<h1 class='errorMessage'>Sorry we couldn't find any results for: <span>${original_fName} ${original_lName}</h1>`);
            } else {
                $results.append(`<h1 class='errorMessage'>Sorry we couldn't find a exact match for: <span>${original_fName} ${original_lName}</h1>`);
            }


            if (isFNameMatch) {

                if (fNameMatch.length > 1) {
                    printPersonRusult(fNameMatch, "Here are " + fNameMatch.length + " matches for the first name", original_fName, "", "firstNameMatch", true)
                } else if (fNameMatch.length == 1) {
                    printPersonRusult(fNameMatch, "There is " + fNameMatch.length + " match for the first name", original_fName, "", "firstNameMatch", true)
                }

            }

            if (isLNameMatch) {

                if (lNameMatch.length > 1) {
                    printPersonRusult(lNameMatch, "Here are " + lNameMatch.length + " matches for the last name", "", original_lName, "lastNameMatch", true)
                } else if (lNameMatch.length == 1) {
                    printPersonRusult(lNameMatch, "There is " + lNameMatch.length + " match for the last name", "", original_lName, "lastNameMatch", true)
                }

            }

        });
    }

    function printPersonRusult(results, messageTitle, fName = fName_input, lName = lName_input, id = 'defautlResult', hidden = false) {

        //  TODO: Sort results, and display the people
        var displayPerson = false
        var displayName = ""

        var divResultID = $(`#results #${id}`)

        if (fName != "") {

            displayPerson = true

            if (lName != "") {
                displayName = `${fName} ${lName}`
            } else {
                displayName = fName
            }

        } else if (lName != "") {
            displayPerson = true
            displayName = lName
        }



        if (displayPerson && displayName != "") {

            if (results.length != 0) {
                $results.append(`<h1 class='resultMessage'>${messageTitle}: <span>${displayName}</h1>`);
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
        
        function yearDiff(d1, d2) {
        
            if (d1 == "Unknown" || d2 == "Unknown") {
                return "Unknown"
            } else if (d1 == "" || d2 == "") { 
                return "Unknown"
            } else {
                let date1 = new Date(d1);
                let date2 = new Date(d2);
                let yearsDiff = ~~(date2.getFullYear() - date1.getFullYear());
                return yearsDiff;

            }
        }


        $(`#results #${id}`).last().append(`
            <div id="${fName_clean}${lName_clean}" class="imgFadeIn">
                <img src="${profileImage}" class="profilePicture"></img>
                <h1><span class='fullName'>${fName} ${lName}</span><br>(${dateOfBirth.year} - ${dateOfDeath.year})</h1>
                <h3>${cemetery} - Block ${blockNum}, Lot ${lotNum} : Grave ${graveNum}${graveSubNum}</h3>
                
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
        
//        console.log(fName, lName)
        
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
                div.append(`<img src="${imagesArray.replace("https", "http")}" class="${addClass}">`);
            } else if (Array.isArray(imagesArray) && imagesArray.length != 0) {
                for (const i in imagesArray) {
                    div.append(`<img src="${imagesArray[i].replace("https", "http")}" class="${addClass}">`);
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

    $("form").submit(function () {

        window.stop();
        $results.empty()
        var $inputs = $('form :input');
        var values = {};
        var sortOption = $("#sortSelect").val();

//        console.log(sortOption);


        $inputs.each(function () {
            values[this.name] = $(this).val();
        });

        function filterInput(name) {
//            console.log(name, typeof name)
            if (name != "" && typeof name == "string") {
                return name.trim()
            } else {
                return ""
            }
        }

        var fInput = filterInput(values['fName_input'])
        var lInput = filterInput(values["lName_input"])

        if (fInput != "") {
            if (lInput != "") {
                getMatches(fInput, lInput, sortOption)
            } else {
                getMatches(fInput, "", sortOption)
            }
        } else if (lInput != "") {
            getMatches("", lInput, sortOption)
        } else {

            $(this).closest('form').find("input[type=text], textarea").val("");
            $results.append("<h1 class='errorMessage'>Invalid Input: Please enter a valid first or last name.</h1>");

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
//    console.log("clicked")
    $(this).next(".results").toggle(400, "swing")
});
