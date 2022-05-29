$().ready(function(){

    console.log("STARTING SLIDESHOW")
    // Get array of images from a folder
    var images = [];
    var image_path = 'assets/images/homepage/slideshow/';
    var image_ext = '.jpg';
    var image_count = 0;
    var image_index = 0;
    var image_timer = 10000;

    // Get the images from the folder
    $.ajax({
        url: image_path,
        success: function(data){

            var images = [];

            $(data).find("a:contains("+image_ext+")").each(function(){
                console.log("Found image: " + this.href);
                images.push($(this).attr('href'));
                image_count++;
            });

            // Start the slideshow, passing in the images array
            startSlideshow(images);
        },
        error: function(data){
            // console.log("Error getting images from folder");
            startSlideshow(["assets/images/homepage/slideshow/1.jpg", "assets/images/homepage/slideshow/2.jpg", "assets/images/homepage/slideshow/3.jpg", "assets/images/homepage/slideshow/4.jpg"]);
        }
    });


    function startSlideshow(images) {

        // Add each image to the slideshow div
        for (var i = 0; i < image_count; i++) {

            if (i == 0) {
                $('.slideshow').append(`<img src="${images[i]}"">`);
            } else {

                $('.slideshow').append('<img class="slideshow" src="' + images[i] + '" style="display: none;">');

            }   
        }

        // Set the timer to change the image
        setTimeout(function(){

            var current = $('.slideshow img:visible');
            var next = current.next().length ? current.next() : $('.slideshow img').first();

            current.fadeOut(1000, function(){
                next.fadeIn(1000);
            });

            // Set the timer to change the image
            setTimeout(arguments.callee, image_timer);

        }, image_timer);

    }

});