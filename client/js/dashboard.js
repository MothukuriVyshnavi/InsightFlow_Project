import {
    getAIExplanation
} from "./api.js";


import {
    getCurrentAnalysis
} from "./upload.js";


let numericChart = null;

let categoryChart = null;

let overviewChart = null;


export function displayDashboard(data) {

    // ==========================
    // Basic information
    // ==========================

    document.getElementById(
        "fileName"
    ).textContent =
        `Dataset: ${data.fileName}`;


    document.getElementById(
        "rowCount"
    ).textContent =
        data.rows;


    document.getElementById(
        "columnCount"
    ).textContent =
        data.columns;


    document.getElementById(
        "missingCount"
    ).textContent =
        data.missingValues;


    document.getElementById(
        "duplicateCount"
    ).textContent =
        data.duplicateRows;


    displayColumns(data);

    displayStatistics(data);

    displayPreview(data);

    createCharts(data);

}


function displayColumns(data) {

    const numeric =
        document.getElementById(
            "numericColumns"
        );


    const categorical =
        document.getElementById(
            "categoricalColumns"
        );


    numeric.innerHTML = "";

    categorical.innerHTML = "";


    if (
        data.numericColumns.length === 0
    ) {

        numeric.innerHTML =
            "<li>No numeric columns found.</li>";

    }


    data.numericColumns.forEach(
        column => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                column;

            numeric.appendChild(li);

        }
    );


    if (
        data.categoricalColumns.length === 0
    ) {

        categorical.innerHTML =
            "<li>No categorical columns found.</li>";

    }


    data.categoricalColumns.forEach(
        column => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                column;

            categorical.appendChild(li);

        }
    );

}


function displayStatistics(data) {

    const container =
        document.getElementById(
            "statisticsContainer"
        );


    container.innerHTML = "";


    const statistics =
        data.statistics;


    const columns =
        Object.keys(statistics);


    if (columns.length === 0) {

        container.innerHTML =
            "<p>No numerical statistics available.</p>";

        return;

    }


    columns.forEach(
        column => {

            const stats =
                statistics[column];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "stat-card";


            card.innerHTML = `

                <h3>${column}</h3>

                <p>
                    Mean:
                    <strong>
                        ${stats.mean}
                    </strong>
                </p>

                <p>
                    Median:
                    <strong>
                        ${stats.median}
                    </strong>
                </p>

                <p>
                    Minimum:
                    <strong>
                        ${stats.minimum}
                    </strong>
                </p>

                <p>
                    Maximum:
                    <strong>
                        ${stats.maximum}
                    </strong>
                </p>

                <p>
                    Standard Deviation:
                    <strong>
                        ${stats.standardDeviation}
                    </strong>
                </p>

            `;


            container.appendChild(card);

        }
    );

}


function displayPreview(data) {

    const head =
        document.getElementById(
            "previewHead"
        );


    const body =
        document.getElementById(
            "previewBody"
        );


    head.innerHTML = "";

    body.innerHTML = "";


    data.columnNames.forEach(
        column => {

            const th =
                document.createElement(
                    "th"
                );

            th.textContent =
                column;

            head.appendChild(th);

        }
    );


    data.preview.forEach(
        row => {

            const tr =
                document.createElement(
                    "tr"
                );


            data.columnNames.forEach(
                column => {

                    const td =
                        document.createElement(
                            "td"
                        );


                    td.textContent =
                        row[column] ?? "";


                    tr.appendChild(td);

                }
            );


            body.appendChild(tr);

        }
    );

}


function createCharts(data) {

    destroyCharts();


    // ==========================
    // Numeric Chart
    // ==========================

    if (
        data.numericColumns.length > 0
    ) {

        const column =
            data.numericColumns[0];


        const values =
            data.data
                .map(
                    row =>
                        Number(
                            row[column]
                        )
                )
                .filter(
                    value =>
                        !isNaN(value)
                );


        numericChart =
            new Chart(
                document.getElementById(
                    "numericChart"
                ),
                {

                    type: "line",

                    data: {

                        labels:
                            values.map(
                                (_, index) =>
                                    `Row ${index + 1}`
                            ),

                        datasets: [

                            {
                                label: column,
                                data: values
                            }

                        ]

                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }

                }
            );

    }


    // ==========================
    // Category Chart
    // ==========================

    if (
        data.categoricalColumns.length > 0
    ) {

        const column =
            data.categoricalColumns[0];


        const counts = {};


        data.data.forEach(
            row => {

                const value =
                    row[column];


                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {

                    const category =
                        String(value);


                    counts[category] =
                        (counts[category] || 0) + 1;

                }

            }
        );


        const labels =
            Object.keys(counts);


        const values =
            Object.values(counts);


        categoryChart =
            new Chart(
                document.getElementById(
                    "categoryChart"
                ),
                {

                    type: "doughnut",

                    data: {

                        labels,

                        datasets: [

                            {
                                label: column,
                                data: values
                            }

                        ]

                    },

                    options: {
                        responsive: true
                    }

                }
            );

    }


    // ==========================
    // Average Chart
    // ==========================

    const statistics =
        data.statistics;


    const statisticColumns =
        Object.keys(statistics);


    if (
        statisticColumns.length > 0
    ) {

        overviewChart =
            new Chart(
                document.getElementById(
                    "overviewChart"
                ),
                {

                    type: "bar",

                    data: {

                        labels:
                            statisticColumns,

                        datasets: [

                            {

                                label:
                                    "Average",

                                data:
                                    statisticColumns.map(
                                        column =>
                                            statistics[
                                                column
                                            ].mean
                                    )

                            }

                        ]

                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }

                }
            );

    }

}


function destroyCharts() {

    if (numericChart) {

        numericChart.destroy();

        numericChart = null;

    }


    if (categoryChart) {

        categoryChart.destroy();

        categoryChart = null;

    }


    if (overviewChart) {

        overviewChart.destroy();

        overviewChart = null;

    }

}


// ==============================
// AI EXPLANATION
// ==============================

export function initializeAI() {

    const button =
        document.getElementById(
            "aiAnalyzeBtn"
        );


    button.addEventListener(
        "click",
        async () => {

            const analysis =
                getCurrentAnalysis();


            if (!analysis) {

                alert(
                    "Please upload a dataset first."
                );

                return;

            }


            const resultBox =
                document.getElementById(
                    "aiResult"
                );


            button.disabled = true;

            button.textContent =
                "AI is analyzing...";


            resultBox.style.display =
                "block";


            resultBox.textContent =
                "Generating AI explanation...";


            try {

                const result =
                    await getAIExplanation(
                        analysis
                    );


                resultBox.textContent =
                    result.explanation;

            }

            catch (error) {

                resultBox.textContent =
                    error.message;

            }

            finally {

                button.disabled = false;

                button.textContent =
                    "Explain My Data with AI";

            }

        }
    );

}