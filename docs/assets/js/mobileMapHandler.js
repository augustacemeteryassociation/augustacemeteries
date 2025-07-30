$(document).ready(function () {

    var scale = 1;
    var translateX = 0;
    var translateY = 0;
    var isDragging = false;
    var isPinching = false;
    var startX = 0;
    var startY = 0;

    $(".svg").on("touchstart", function(e) {
    if (e.touches.length === 1) {
        // Handle single touch event (move)
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // Handle double touch event (pinch)
        isPinching = true;
        isDragging = false;
        startX = e.touches[0].clientX - e.touches[1].clientX;
        startY = e.touches[0].clientY - e.touches[1].clientY;
    } else if (e.touches.length === 3) {
        // Handle triple touch event (reset)
        resetMap();
    }
    });

    $(".svg").on("touchmove", function(e) {
    if (isDragging) {
        // Handle single touch event (move)
        var newX = e.touches[0].clientX;
        var newY = e.touches[0].clientY;
        translateX += newX - startX;
        translateY += newY - startY;
        startX = newX;
        startY = newY;

        $(this).css("transform", "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")");
    } else if (isPinching) {
        // Handle double touch event (pinch)
        var newX = e.touches[0].clientX - e.touches[1].clientX;
        var newY = e.touches[0].clientY - e.touches[1].clientY;
        var newScale = Math.sqrt(newX * newX + newY * newY) / Math.sqrt(startX * startX + startY * startY);
        scale *= newScale;
        startX = newX;
        startY = newY;

        $(this).css("transform", "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")");
    }

        e.preventDefault();
    });

    $(".svg").on("touchend", function(e) {
        isDragging = false;
        isPinching = false;
    });


    $(".mapSelection > ul > li").on("click", function() {
        resetMap();
    })


    function resetMap() {
        translateX = 0;
        translateY = 0;
        scale = 1;
        $(".svg").css("transform", "translate(0px, 0px) scale(1)");
    }
    
})