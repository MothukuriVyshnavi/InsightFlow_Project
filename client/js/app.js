import {
    analyzeDataset
} from "../api/api.js";

import {
    generateBasicInsights,
    displayInsights
} from "./aiExplainer.js";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const fileInput =
            document.getElementById("fileInput");

        const analyzeBtn =
            document.getElementById("analyzeBtn");

        const fileName =
            document.getElementById("fileName");

        const uploadMessage =
            document.getElementById("uploadMessage");

        const dropZone =
            document.getElementById("dropZone");


        /* =========================================
           CHECK ELEMENTS
        ========================================= */

        if (
            !fileInput ||
            !analyzeBtn
        ) {

            console.error(
                "Analyze page elements not found."
            );

            return;

        }


        let selectedFile = null;


        /* =========================================
           FILE SELECT
        ========================================= */

        fileInput.addEventListener(
            "change",
            function () {

                if (
                    fileInput.files.length === 0
                ) {

                    return;

                }


                handleFile(
                    fileInput.files[0]
                );

            }
        );


        /* =========================================
           HANDLE FILE
        ========================================= */

        function handleFile(file) {

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            if (extension !== "csv") {

                selectedFile = null;

                analyzeBtn.disabled = true;

                fileName.textContent =
                    "Please select a CSV file.";

                showMessage(
                    "Only CSV files are supported.",
                    "error"
                );

                return;

            }


            selectedFile = file;

            fileName.textContent =
                file.name;

            analyzeBtn.disabled =
                false;


            showMessage(
                "CSV file selected successfully.",
                "success"
            );

        }


        /* =========================================
           DRAG & DROP
        ========================================= */

        if (dropZone) {

            dropZone.addEventListener(
                "dragover",
                function (event) {

                    event.preventDefault();

                    dropZone.classList.add(
                        "drag-over"
                    );

                }
            );


            dropZone.addEventListener(
                "dragleave",
                function () {

                    dropZone.classList.remove(
                        "drag-over"
                    );

                }
            );


            dropZone.addEventListener(
                "drop",
                function (event) {

                    event.preventDefault();

                    dropZone.classList.remove(
                        "drag-over"
                    );


                    if (
                        event.dataTransfer.files
                            .length === 0
                    ) {

                        return;

                    }


                    handleFile(
                        event.dataTransfer.files[0]
                    );

                }
            );

        }


        /* =========================================
           ANALYZE BUTTON
        ========================================= */

        analyzeBtn.addEventListener(
            "click",
            async function () {

                if (!selectedFile) {

                    showMessage(
                        "Please select a CSV file first.",
                        "error"
                    );

                    return;

                }


                analyzeBtn.disabled = true;

                analyzeBtn.textContent =
                    "Analyzing...";


                showMessage(
                    "Uploading and analyzing your dataset...",
                    "success"
                );


                try {

                    const result =
                        await analyzeDataset(
                            selectedFile
                        );


                    console.log(
                        "API Response:",
                        result
                    );


                    if (
                        !result.success
                    ) {

                        throw new Error(
                            result.message ||
                            "Analysis failed."
                        );

                    }


                    displayResults(
                        result.dataset
                    );


                    showMessage(
                        "Dataset analyzed successfully!",
                        "success"
                    );

                }

                catch (error) {

                    console.error(
                        "Analysis Error:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "Unable to analyze the dataset.",
                        "error"
                    );

                }


                analyzeBtn.disabled =
                    false;

                analyzeBtn.textContent =
                    "Analyze Data";

            }
        );


        /* =========================================
           DISPLAY RESULTS
        ========================================= */

        function displayResults(
            dataset
        ) {

            const resultsSection =
                document.getElementById(
                    "resultsSection"
                );


            const resultRows =
                document.getElementById(
                    "resultRows"
                );


            const resultColumns =
                document.getElementById(
                    "resultColumns"
                );


            const resultFile =
                document.getElementById(
                    "resultFile"
                );


            const insightsContainer =
                document.getElementById(
                    "insightsContainer"
                );


            const previewContainer =
                document.getElementById(
                    "previewContainer"
                );


            /* =====================================
               BASIC INFORMATION
            ===================================== */

            resultRows.textContent =
                dataset.rows;


            resultColumns.textContent =
                dataset.columns;


            resultFile.textContent =
                dataset.filename;


            /* =====================================
               INSIGHTS
            ===================================== */

            const insights =
                generateBasicInsights(
                    dataset
                );


            displayInsights(
                insights,
                insightsContainer
            );


            /* =====================================
               PREVIEW
            ===================================== */

            displayPreview(
                dataset,
                previewContainer
            );


            /* =====================================
               SHOW RESULTS
            ===================================== */

            resultsSection.style.display =
                "block";


            resultsSection.scrollIntoView({
                behavior: "smooth"
            });

        }


        /* =========================================
           DISPLAY TABLE PREVIEW
        ========================================= */

        function displayPreview(
            dataset,
            container
        ) {

            container.innerHTML = "";


            if (
                !dataset.preview ||
                dataset.preview.length === 0
            ) {

                container.textContent =
                    "No preview data available.";

                return;

            }


            const table =
                document.createElement(
                    "table"
                );


            table.className =
                "data-table";


            /* TABLE HEADER */

            const thead =
                document.createElement(
                    "thead"
                );


            const headerRow =
                document.createElement(
                    "tr"
                );


            dataset.headers.forEach(
                function (header) {

                    const th =
                        document.createElement(
                            "th"
                        );

                    th.textContent =
                        header;

                    headerRow.appendChild(
                        th
                    );

                }
            );


            thead.appendChild(
                headerRow
            );


            /* TABLE BODY */

            const tbody =
                document.createElement(
                    "tbody"
                );


            dataset.preview.forEach(
                function (row) {

                    const tr =
                        document.createElement(
                            "tr"
                        );


                    dataset.headers.forEach(
                        function (header) {

                            const td =
                                document.createElement(
                                    "td"
                                );


                            td.textContent =
                                row[header] ?? "";


                            tr.appendChild(
                                td
                            );

                        }
                    );


                    tbody.appendChild(
                        tr
                    );

                }
            );


            table.appendChild(
                thead
            );


            table.appendChild(
                tbody
            );


            container.appendChild(
                table
            );

        }


        /* =========================================
           MESSAGE
        ========================================= */

        function showMessage(
            message,
            type
        ) {

            uploadMessage.textContent =
                message;


            uploadMessage.className =
                "upload-message";


            if (type) {

                uploadMessage.classList.add(
                    type
                );

            }

        }

    }
);