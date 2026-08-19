import {
    initializeUpload
} from "./upload.js";


import {
    initializeAI
} from "./dashboard.js";


const getStartedBtn =
    document.getElementById(
        "getStartedBtn"
    );


function initializeNavigation() {

    getStartedBtn.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "upload"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


function initializeApplication() {

    initializeNavigation();

    initializeUpload();

    initializeAI();

}


initializeApplication();