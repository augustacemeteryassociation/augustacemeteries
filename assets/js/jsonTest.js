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
                return `${monthStr} ${day}, ${year}`
            } else {
                return `${monthStr} ${year}`
            }

        } else {
            return `${year}`
        }

    } else {
        return "Unknown"
    }

}

$().ready(function () {

//    function observeImages() {
//        const targets = document.querySelectorAll('img');
//        const lazyLoad = target => {
//            const io = new IntersectionObserver((entries, observer) => {
//                entries.forEach(entry => {
//
//                    if (entry.isIntersecting) {
//                        const img = entry.target;
//                        const src = img.getAttribute('data-lazy');
//
//                        img.setAttribute('src', src);
//                        observer.disconnect();
//                    }
//                });
//            });
//            io.observe(target);
//        };
//        targets.forEach(lazyLoad);
//    }

    function getBlockID(selectedVal) {
        switch (selectedVal) {

            case "eastA":
                var graveLocation = "EastLawn"
                var blockID = "A";
                break
            case "eastB":
                var graveLocation = "EastLawn"
                var blockID = "B";
                break
            case "eastC":
                var graveLocation = "EastLawn"
                var blockID = "C";
                break
            case "east1":
                var graveLocation = "EastLawn"
                var blockID = "1";
                break
            case "east2":
                var graveLocation = "EastLawn"
                var blockID = "2";
                break
            case "east3":
                var graveLocation = "EastLawn"
                var blockID = "3";
                break
            case "east4":
                var graveLocation = "EastLawn"
                var blockID = "4";
                break


            case "west0":
                var graveLocation = "WestLawn"
                var blockID = "0";
                break
            case "west1":
                var graveLocation = "WestLawn"
                var blockID = "1";
                break
            case "west2":
                var graveLocation = "WestLawn"
                var blockID = "2";
                break
            case "west3":
                var graveLocation = "WestLawn"
                var blockID = "3";
                break
            case "west4":
                var graveLocation = "WestLawn"
                var blockID = "4";
                break
            case "west5":
                var graveLocation = "WestLawn"
                var blockID = "5";
                break


            case "default":
                var graveLocation = "EastLawn"
                var blockID = "A"
                break
        }

        getGrave(graveLocation, blockID);
    }

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

    function getGrave(graveLocation, blockID) {
        $.getJSON("json/graves.json", function (data) {
            
            function checkURL(url) {
                return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            }

            for (cemetery in data) {

                if (cemetery == graveLocation) {

                    $("results").append(cemetery);

                    for (blockNum in data[cemetery]) {

                        if (blockNum == blockID) {

                            for (lotNum in data[cemetery][blockNum]) {

                                for (graveNum in data[cemetery][blockNum][lotNum]) {

                                    for (g in data[cemetery][blockNum][lotNum][graveNum]) {

                                        var d = data[cemetery][blockNum][lotNum][graveNum][g]


                                        var fName = d["fName"]


                                        if (fName != "") {


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

//                                            if (obituaryImages != "") {
//                                                console.log(obituaryImages, lotNum, graveNum, fName, lName);
//                                            }


                                            


                                            // MAKE SURE ALL PROFILE LINKS ARE VALID
                                            if (profileImage == "") {
                                                profileImage = "images/unknown.png"
                                            } 
//                                            else {
//                                                if (checkURL(profileImage) == false) {
//                                                    console.log(cemetery, blockNum, lotNum, graveNum, g);
//                                                }
//                                            }
                                            
                                            // MAKE SURE OTHER IMAGES ARE VALID
                                            
                                            if (profileImage != []) {
                                                for (i in profileImage) {
                                                    if (checkURL(profileImage[i]) != false) {
                                                        console.log(cemetery, blockNum, lotNum, graveNum, g);
                                                    }
                                                }
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
                                    }
                                }
                            }
                        }
                    } // END OF BlockNum variable
                } // END OF Cemetery If statement
            } // END OF Cemetery variable
        });


        // Timeout / Delay for IntersectionObserver
        // *** Need to have the content generated first, in order for the IntersectionObserver to work properly. ***
//        setTimeout(observeImages, 100);

    }


    $("select").change(function () {
        window.stop();
        $("#results").empty();

        var blockID = $(this).children("option:selected").val();
        getBlockID(blockID);
    });

    var initOption = $("select").children("option:selected").val();
    getBlockID(initOption);



});



//$(document).on('click', '.moreDetails', function() {
//    $(".details", this).toggle(400, "swing");
//});


$(document).on('click', '.moreDetails', function () {
    
    var message = $(this).text().trim();
    
    if (message == "More Details") {
        $(this).html("<h2>Less Details</h2>");
    } else {
        $(this).html("<h2>More Details</h2>")
    }
    
    $(this).next().toggle(400, "swing");
});
