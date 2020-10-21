function cleanString(s) {
    return s.replace(/[^a-zA-Z ]/g, "");
}

function getDate(dateStr) {
    //            console.log(dateStr)
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

    var year = dateObject.year
    var month = dateObject.month
    var day = dateObject.day

    if (year != undefined) {

        if (month != undefined) {

            switch (month) {
                case 1:
                    var monthStr = "January"
                case 2:
                    var monthStr = "February"
                case 3:
                    var monthStr = "March"
                case 4:
                    var monthStr = "April"
                case 5:
                    var monthStr = "May"
                case 6:
                    var monthStr = "June"
                case 7:
                    var monthStr = "July"
                case 8:
                    var monthStr = "August"
                case 9:
                    var monthStr = "September"
                case 10:
                    var monthStr = "October"
                case 11:
                    var monthStr = "November"
                case 12:
                    var monthStr = "December"
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

$().ready(function () {

    //        function observeImages() {
    //            const targets = document.querySelectorAll('img');
    //            const lazyLoad = target => {
    //                const io = new IntersectionObserver((entries, observer) => {
    //                    entries.forEach(entry => {
    //
    //                        if (entry.isIntersecting) {
    //                            const img = entry.target;
    //                            const src = img.getAttribute('data-lazy');
    //
    //                            img.setAttribute('src', src);
    //                            observer.disconnect();
    //                        }
    //                    });
    //                });
    //                io.observe(target);
    //            };
    //            targets.forEach(lazyLoad);
    //        }

    var $results = $("#results")

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

    function getMatches(fName_input, lName_input) {



        $results.empty();

        $.getJSON("json/graves.json", function (data) {

            var matches = []
            var exactMatch = []
            var fNameMatch = []
            var lNameMatch = []

            var fName_inputLower = fName_input.toLowerCase();
            var lName_inputLower = lName_input.toLowerCase();
            var count = 0;


            for (cemetery in data) {

                $("results").append(cemetery);

                for (blockNum in data[cemetery]) {

                    for (lotNum in data[cemetery][blockNum]) {

                        for (graveNum in data[cemetery][blockNum][lotNum]) {

                            for (g in data[cemetery][blockNum][lotNum][graveNum]) {

                                var d = data[cemetery][blockNum][lotNum][graveNum][g]

                                var fName = d["fName"].toLowerCase()
                                var mName = d["mName"].toLowerCase()
                                var lName = d["lName"].toLowerCase()
                                var maidenName = d["maidenName"].toLowerCase()
                                var otherInfo = d["otherInfo"].toLowerCase()



                                // TODO: Fix Result sorting system
                                // VALID FIRSTNAME
                                if (fName != "") {





                                    //VALID LAST NAME    
                                    if (lName != "") {

                                        if (fName.includes(fName_input)) {
                                            colsole.log(fName, lName);
                                            console.log("DATA", d);
                                        }




                                        // ONLY THE FIRST NAME IS VALID
                                    } else {

                                        //                                        fNameMatch.push(d)

                                    }

                                    // ONLY LAST NAME IS VALID
                                } else if (lName != "") {

                                    //                                    lNameMatch.push(d)

                                }
                                // ELSE: NAME IS NOT VALID - NOTHING HAPPENS


                                //                                            if ((fName != "" && fName.includes(fName_inputLower)) || (otherInfo != "" && otherInfo.includes(fName_inputLower))) {
                                //                                                
                                //                                                
                                ////                                                console.log(fName, lName)
                                //                                                
                                //                                                console.log(lName, lName_inputLower)
                                //                                                
                                //                                                count++;
                                //
                                //                                                //                                    console.log(count)
                                //                                                //
                                //                                                //                                    console.log(fName, lName)
                                //
                                //                                                //                                    console.log(lName, lName_input)
                                //
                                //                                                if ((lName != "" && lName.includes(lName_inputLower)) || (maidenName != "" && maidenName.includes(lName_inputLower))) {
                                //                                                    exactMatch.push(d);
                                //                                                } else {
                                //                                                    fNameMatch.push(d);
                                //                                                }
                                //
                                //                                            } else {
                                //
                                //                                                if ((lName != "" && lName.includes(lName_inputLower)) || (maidenName != "" && maidenName.includes(lName_inputLower))) {
                                //                                                    lNameMatch.push(d);
                                //                                                }
                                //
                                //
                                //                                            }

                            }
                        }
                    }
                }
            }



            //            console.log(closeMatch_fName, closeMatch_fName.sort())

            console.log(exactMatch)
            console.log(fNameMatch)
            console.log(lNameMatch)

            function printPersonRusult(results, messageTitle, fName = fName_input, lName = lName_input) {



                //  TODO: Sort results, and display the people
                // BOTH NAMES ARE VAILD
                if (fName != "" && lName != "") {

                    if (results.length != 0) {
                        $results.append(`<h1 class='resultMessage'>${messageTitle}: <span>${fName} ${lName}</h1>`);

                        for (var d in exactMatch) {
                            displayPeople(exactMatch[d]);
                        }
                    } else {
                        $results.append(`<h1 class='errorMessage'>Sorry we couldn't find a match for: <span>${fName} ${lName}</h1>`);
                    }

                    // ONLY FNAME IS VAILD
                } else if (fName != "") {


                    // ONLY LNAME IS VALID   
                } else if (lName != "") {



                }


            }




            if (exactMatch.length != 0) {
                printPersonRusult(exactMatch, "Exact Match for")
            }

            //                            if (closeMatch_fName.length != 0 && closeMatch_fName.length != 0) {
            //
            //                                if (exactResult.length == 0) {
            //                                    $results.append(`<h1 class='resultMessage'>Sorry, we couldn't find a exact match for: <span>${fName_input} ${lName_input}</span></h1>`);
            //                                }
            //
            //
            //                                if (closeMatch_fName.length != 0) {
            //                                    $results.append(`<h1 class='resultMessage'>Here are some other people with the first name that contains: <span>${fName_input}</span></h1>`)
            //                                    for (var d in closeMatch_fName) {
            //                                        displayPeople(closeMatch_fName[d]);
            //                                    }
            //                                }
            //
            //                                if (closeMatch_lName.length != 0) {
            //                                    $results.append(`<h1 class='resultMessage'>Here are some other people with the last name that contains: <span>${lName_input}</span></h1>`)
            //                                    for (var d in closeMatch_lName) {
            //                                        displayPeople(closeMatch_lName[d]);
            //                                    }
            //                                }
            //
            //
            //                            } else if (closeMatch_fName.length != 0 || closeMatch_lName.length != 0) {
            //
            //                                if (closeMatch_fName.length != 0) {
            //                                    $results.append(`<h1 class='resultMessage'>Here are some other people with the first name that contains: <span>${fName_input}</span></h1>`)
            //                                    for (var d in closeMatch_fName) {
            //                                        displayPeople(closeMatch_fName[d]);
            //                                    }
            //                                }
            //
            //                                if (closeMatch_lName.length != 0) {
            //                                    $results.append(`<h1 class='resultMessage'>Here are some other people with the last name that contains: <span>${lName_input}</span></h1>`)
            //                                    for (var d in closeMatch_lName) {
            //                                        displayPeople(closeMatch_lName[d]);
            //                                    }
            //                                }
            //
            //                            } else {
            //                                $results.append(`<h1 class='resultMessage'>Sorry, no results were found.</h1>`);
            //                            }



            //            if (closeMatch_fName.length != 0) {
            //                results.append(`<h1 class='resultMessage'>Here are some other people with the first name: <span>${fName_input}</span></h1>`)
            //                for (var d in closeMatch_fName) {
            //                    displayPeople(closeMatch_fName[d]);
            //                }
            //            }
            //
            //
            //            if (closeMatch_lName.length != 0) {
            //                results.append(`<h1 class='resultMessage'>Here are some other people with the last name: <span>${lName_input}</span></h1>`)
            //                displayPeople(exactResult[d]);
            //            }






        });





        // Timeout / Delay for IntersectionObserver
        // *** Need to have the content generated first, in order for the IntersectionObserver to work properly. ***
        //        setTimeout(observeImages, 100);

    }

    function displayPeople(d) {


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

        //        if (obituaryImages != "") {
        //            console.log(obituaryImages, lotNum, graveNum, fName, lName);
        //        }






        if (profileImage == "") {
            profileImage = "images/unknown.png"
        }


        $("#results").append(`
            <div id="${fName_clean}${lName_clean}" class="imgFadeIn">
                <img src="${profileImage}" class="profilePicture"></img>
                <h1>${fName} ${lName}<br>(${dateOfBirth.year} - ${dateOfDeath.year})</h1>
                <h3>Block ${blockNum}, Lot ${lotNum} - Grave ${graveNum}${g}</h3>

                <div class="moreDetails">
                    <h2 class="moreDetailsButton">More Details</h2>
                </div>

                <div class="details"></div>
            </div>
        `);


        var latestPerson = $("#results div").last()

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



    }


    $("select").change(function () {
        window.stop();
        $("#results").empty();

        var blockID = $(this).children("option:selected").val();
        //        getBlockID(blockID);
    });

    var initOption = $("select").children("option:selected").val();
    //    getBlockID(initOption);

    $("form").submit(function () {


        $results.empty()
        var $inputs = $('form :input');
        var values = {};

        $inputs.each(function () {
            values[this.name] = $(this).val();
        });


        //         $(document).closest('form').find("input[type=text], textarea").val("");

        //        $("input").each(()=> {
        //            
        //            console.log($(this).find("").find("input[type=text], textarea").val(""))
        //            
        //        });

        //        var values = $("input").serializeArray
        //        console.log(values)


        function filterInput(name) {
            console.log(name, typeof name)
            if (name != "" && typeof name == "string") {
                return name.trim()
            } else {
                return ""
            }
        }


        console.log(values)
        var fInput = filterInput(values['fName_input'])
        var lInput = filterInput(values["lName_input"])


        console.log(fInput, lInput);



        if (fInput != "") {
            if (lInput != "") {

                getMatches(fInput, lInput)

            } else {
                getMatches(fInput, "")
            }

        } else if (lInput != "") {

            getMatches("", lInput)

        } else {
            // TODO: Clear inputs at display error message

            //            $(this).closest('form').find("input[type=text], textarea").val("");
            $results.append("<h1 class='errorMessage'>Invalid Input: Please enter a valid first or last name.</h1>");

        }



        //        getMatches(values['fName_input'], values['lName_input']);


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
