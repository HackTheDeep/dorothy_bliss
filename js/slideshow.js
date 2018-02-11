var images = [
    { 
        url: "/img/326504.jpg",
        caption: "Dorothy E. Bliss: Curator, Department of Living Invertebrates",
        citation: "Image no. 326504, AMNH Library"
    },
    { 
        url: "/img/335299.jpg",
        caption: "",
        citation: "Image no. 334299, AMNH Library"
    }
]

$(document).ready(function(){  
    changeImage();
    setTimeout(() => {
        $("#center-crab-wrapper").fadeOut(() => {
            $("#everything").fadeIn(() => {
                $("body").css("background-color", "white")
            });
        })
        var imageChanger = window.setInterval(changeImage, 5000);
    }, 1500);
})

var imageNumber = 0

function changeImage() {
    var imagesLength = images.length - 1;
    $("#page-top").css("background-image", "url(\"" + images[imageNumber].url + "\")")
    $("#caption-citation-text").fadeOut(function(){
        $("#caption-citation-text").text(images[imageNumber].caption + " (" + images[imageNumber].citation + ")");
        $("#caption-citation-text").fadeIn();
        imageNumber++;
        if(imageNumber > imagesLength) {
            imageNumber = 0;
        }
    })
}