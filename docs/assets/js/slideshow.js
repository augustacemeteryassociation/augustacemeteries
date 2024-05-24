$().ready(function(){

    // console.log("STARTING SLIDESHOW")
    // Get array of images from a folder
    var images = [];
    var image_path = 'assets/images/homepage/slideshow/';
    var image_ext = '.jpg';
    var image_count = 0;
    var image_index = 0;
    var image_timer = 10000;

    // Get the images from the folder
    // $.ajax({
    //     url: image_path,
    //     success: function(data){

    //         var images = [];

    //         $(data).find("a:contains("+image_ext+")").each(function(){
    //             console.log("Found image: " + this.href);
    //             images.push($(this).attr('href'));
    //             image_count++;
    //         });

    //         // Start the slideshow, passing in the images array
    //         startSlideshow(images);
    //     },
    //     error: function(data){
    //         // console.log("Error getting images from folder");
    //         startSlideshow(["assets/images/homepage/slideshow/1.jpg", "assets/images/homepage/slideshow/2.jpg", "assets/images/homepage/slideshow/3.jpg", "assets/images/homepage/slideshow/4.jpg"]);
    //     }
    // });

    // Start the slideshow
    images = ["assets/images/homepage/slideshow/1.jpg", "assets/images/homepage/slideshow/2.jpg", "assets/images/homepage/slideshow/3.jpg", "assets/images/homepage/slideshow/4.jpg", "assets/images/homepage/slideshow/5.jpg"];
    image_count = images.length;
    // Add each image to the slideshow div
    for (var i = 0; i < image_count; i++) {

        if (i == 0) {
            $('#mainSlideshow').append(`<img src="${images[i]}"">`);
        } else {

            $('#mainSlideshow').append('<img class="slideshow" src="' + images[i] + '" style="display: none;">');

        }   
    }

    // Set the timer to change the image
    setTimeout(function(){

        var current = $('#mainSlideshow img:visible');
        var next = current.next().length ? current.next() : $('#mainSlideshow img').first();

        current.fadeOut(1000, function(){
            next.fadeIn(1000);
        });

        // Set the timer to change the image
        setTimeout(arguments.callee, image_timer);

    }, image_timer);

}

);


