/*node browser: true */ /*global $ */ /*global alert */
/*global updateContent */ /*node long: true */
$(document).ready(function () {
    $(".accordion .accordion-cell:first").addClass("active");
    $(".accordion h3:first").addClass("active-acc-text");
    $(".accordion p:not(:first)").hide();

    $(".accordion h3").click(function () {
        $(this).parent(".accordion-cell").siblings(".accordion-cell").removeClass("active");
        $(this).parent(".accordion-cell").toggleClass("active");

        $(this).next("p").slideToggle("slow");
        $(this).parent(".accordion-cell").siblings(".accordion-cell").children("p:visible").slideUp("slow");

        $(this).toggleClass("active-acc-text");
        $(this).parent(".accordion-cell").siblings(".accordion-cell").children("h3").removeClass("active-acc-text");
    });
});