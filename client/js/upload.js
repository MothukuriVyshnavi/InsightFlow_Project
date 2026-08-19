/* =========================================
   INSIGHTFLOW
   CSV UPLOAD HANDLER
========================================= */


// =========================================
// GET HTML ELEMENTS
// =========================================

const csvFile =
    document.getElementById("csvFile");

const dropZone =
    document.getElementById("dropZone");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const filePreview =
    document.getElementById("filePreview");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeFile =
    document.getElementById("removeFile");

const analysisResult =
    document.getElementById("analysisResult");


// =========================================
// SELECTED FILE
// =========================================

let selectedFile = null;



// =========================================
// FILE INPUT
// =========================================

csvFile.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        handleFile(file);

    }
);



// =========================================
// DRAG OVER
// =========================================

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);



// =========================================
// DRAG LEAVE
// =========================================

dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "dragover"
        );

    }
);



// =========================================
// DROP FILE
// =========================================

dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );


        const file =
            event.dataTransfer.files[0];


        handleFile(file);

    }
);



// =========================================
// HANDLE FILE
// =========================================

function handleFile(file) {

    if (!file) {

        return;

    }


    // Check CSV format

    if (
        !file.name
            .toLowerCase()
            .endsWith(".csv")
    ) {

        alert(
            "Please upload a CSV file."
        );

        return;

    }


    // Store selected file

    selectedFile = file;


    // Display file name

    fileName.textContent =
        file.name;


    // Display file size

    fileSize.textContent =
        formatFileSize(
            file.size
        );


    // Show preview

    filePreview.classList.remove(
        "hidden"
    );


    // Enable analyze button

    analyzeBtn.disabled = false;

}



// =========================================
// FORMAT FILE SIZE
// =========================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }


    if (
        bytes <
        1024 * 1024
    ) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }


    return (
        bytes /
        (1024 * 1024)
    ).toFixed(1) + " MB";

}



// =========================================
// REMOVE FILE
// =========================================

removeFile.addEventListener(
    "click",
    function () {

        selectedFile = null;


        csvFile.value = "";


        filePreview.classList.add(
            "hidden"
        );


        analyzeBtn.disabled = true;


        analysisResult.classList.add(
            "hidden"
        );

    }
);



// =========================================
// ANALYZE BUTTON
// =========================================

analyzeBtn.addEventListener(
    "click",
    function () {

        if (!selectedFile) {

            return;

        }


        console.log(
            "Selected file:",
            selectedFile
        );


        /*
         * Backend integration will be
         * added in the next stage.
         *
         * The selected CSV file will be
         * sent to the Express backend
         * for data analysis.
         */


        alert(
            "Dataset selected successfully. Backend analysis will be connected next."
        );

    }
);