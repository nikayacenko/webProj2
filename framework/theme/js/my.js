/*node browser: true */ /*global $ */ /*global alert */
/*global updateContent */
window.addEventListener("DOMContentLoaded", function () {

    let but = document.getElementById("tarif");
    but.addEventListener("click", function () {
        let element = document.getElementById("idforbutton");
        element.scrollIntoView({behavior: "smooth"});
        but.classList.remove("active");
    });
});