
/*node browser: true */ /*global $ */ /*global alert */
/*global updateContent */ /*node long: true */
$(document).ready(function () {
    $(".slider").slick({
        arrows: false,
        autoplay: true,
        infinite: true,
        responsive: [{
            breakpoint: 900,
            settings: {
                autoplay: true,
                infinite: true,
                slidesToShow: 2.7,
                speed: 2000
            }
        }],
        slidesToScroll: 1,
        slidesToShow: 5,
        speed: 2000
    });
});
$(document).ready(function () {
    $(".slider2").slick({
        arrows: false,
        autoplay: true,
        infinite: true,
        responsive: [{
            breakpoint: 900,
            settings: {
                autoplay: true,
                infinite: true,
                slidesToShow: 2.7,
                speed: 2000
            }
        }],
        slidesToScroll: 2,
        slidesToShow: 5,
        speed: 2000
    });
});

$(document).ready(function () {
    $(".single-item").slick({
        adaptiveHeight: true,
        cssEase: "linear",
        dots: false,
        fade: true,
        infinite: true,
        nextArrow: document.querySelector("#my-arrow-next"),
        prevArrow: document.querySelector("#my-arrow-prev"),
        slidesToScroll: 1,
        slidesToShow: 1,
        speed: 300
    });

    let n = 1;
    const prevbtn = document.getElementById("my-arrow-prev");
    const nextbtn = document.getElementById("my-arrow-next");
    let num = document.getElementById("slide-current-number");

    prevbtn.addEventListener("click", function () {
        if (n === 1) {
            n = 8;
        } else {
            n -= 1;
        }
        num.innerHTML = "0" + n;
    });
    nextbtn.addEventListener("click", function () {
        if (n === 8) {
            n = 1;
        } else {
            n += 1;
        }
        num.innerHTML = "0" + n;
    });
});