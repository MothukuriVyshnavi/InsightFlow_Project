import {
    uploadDataset
} from "./api.js";


import {
    displayDashboard
} from "./dashboard.js";


const fileInput =
    document.getElementById(
        "fileInput"
    );


const uploadBtn =
    document.getElementById(
        "uploadBtn"
    );


const uploadStatus =
    document.getElementById(
        "uploadStatus"
    );


let currentAnalysis = null;


export function getCurrentAnalysis() {

    return currentAnalysis;

}


export function initializeUpload() {

    uploadBtn.addEventListener(
        "click",
        handleUpload
    );

}


async function handleUpload() {

    const file =
        fileInput.files[0];


    if (!file) {

        uploadStatus.textContent =
            "Please select a CSV file.";

        return;

    }


    if (
        !file.name
            .toLowerCase()
            .endsWith(".csv")
    ) {

        uploadStatus.textContent =
            "Only CSV files are allowed.";

        return;

    }


    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        uploadStatus.textContent =
            "File size must be less than 10 MB.";

        return;

    }


    uploadBtn.disabled = true;

    uploadBtn.textContent =
        "Analyzing...";


    uploadStatus.textContent =
        "Uploading and analyzing your dataset...";


    try {

        const result =
            await uploadDataset(file);


        currentAnalysis =
            result;


        displayDashboard(result);


        uploadStatus.textContent =
            "Dataset analyzed successfully!";


        document
            .getElementById(
                "dashboard"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }

    catch (error) {

        console.error(error);

        uploadStatus.textContent =
            error.message ||
            "Failed to connect to server.";

    }

    finally {

        uploadBtn.disabled = false;

        uploadBtn.textContent =
            "Analyze Dataset";

    }

}