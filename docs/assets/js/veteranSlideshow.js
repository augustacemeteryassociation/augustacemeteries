$().ready(function(){

    // console.log("STARTING SLIDESHOW")
    // Get array of images from a folder
    var images = [];
    var image_path = 'assets/images/homepage/slideshow/';
    var image_ext = '.jpg';
    var image_count = 0;
    var image_index = 0;
    var image_timer = 10000;


    // Start the slideshow

    var images = [];

    for (var i = 1; i <= 9; i++) {
        images.push("assets/images/homepage/warMemorial/" + i + ".jpg");
    }

    image_count = images.length;
    // Add each image to the slideshow div
    for (var i = 0; i < image_count; i++) {

        if (i == 0) {
            $('#veteranSlideshow').append(`<img src="${images[i]}"">`);
        } else {

            $('#veteranSlideshow').append('<img class="slideshow" src="' + images[i] + '" style="display: none;">');

        }   
    }

    // Set the timer to change the image
    setTimeout(function(){

        var current = $('#veteranSlideshow img:visible');
        var next = current.next().length ? current.next() : $('#veteranSlideshow img').first();

        current.fadeOut(1000, function(){
            next.fadeIn(1000);
        });

        // Set the timer to change the image
        setTimeout(arguments.callee, image_timer);

    }, image_timer);

    $("#veteranSlideshow > img").each(function(){
        $(this).attr("onclick", "window.open(this.src, '_blank')")
    });
    
}

);