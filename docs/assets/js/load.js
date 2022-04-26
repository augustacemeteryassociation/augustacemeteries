$().ready(function() {

    //LOAD IMPORTS
    $.ajax({
        type: "GET",
        url: "templates/head.html",
        async: false,
        success: function(text) {
            $("head").append(text);
        }
    })
    
    $(".fonts").load("././templates/fonts.html");
    $("nav").load("././templates/nav.html");
    $("footer").load("././templates/footer.html", function() {
        var year = new Date().getFullYear();
        $(".currentYear").html(year);
    });

    // fade page in
    $("html").fadeIn(1250);
    
});