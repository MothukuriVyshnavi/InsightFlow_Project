const fs =
    require("fs");

const csv =
    require("csv-parser");


function readCSV(filePath) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const rows = [];


            fs.createReadStream(
                filePath
            )

                .pipe(
                    csv()
                )

                .on(
                    "data",
                    row => {

                        rows.push(row);

                    }
                )

                .on(
                    "end",
                    () => {

                        resolve(rows);

                    }
                )

                .on(
                    "error",
                    error => {

                        reject(error);

                    }
                );

        }
    );

}


function calculateMean(values) {

    if (
        values.length === 0
    ) {

        return 0;

    }


    const total =
        values.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );


    return total /
        values.length;

}


function calculateMedian(values) {

    if (
        values.length === 0
    ) {

        return 0;

    }


    const sorted =
        [...values].sort(
            (a, b) =>
                a - b
        );


    const middle =
        Math.floor(
            sorted.length / 2
        );


    if (
        sorted.length % 2 === 0
    ) {

        return (
            sorted[middle - 1] +
            sorted[middle]
        ) / 2;

    }


    return sorted[middle];

}


function calculateStandardDeviation(
    values,
    mean
) {

    if (
        values.length === 0
    ) {

        return 0;

    }


    const variance =
        values.reduce(
            (
                sum,
                value
            ) =>
                sum +
                Math.pow(
                    value - mean,
                    2
                ),
            0
        ) /
        values.length;


    return Math.sqrt(
        variance
    );

}


function analyzeData(data) {

    if (
        !data ||
        data.length === 0
    ) {

        throw new Error(
            "The CSV file is empty."
        );

    }


    const columnNames =
        Object.keys(
            data[0]
        );


    const rows =
        data.length;


    const columns =
        columnNames.length;


    // ============================
    // Missing Values
    // ============================

    let missingValues = 0;


    data.forEach(
        row => {

            columnNames.forEach(
                column => {

                    const value =
                        row[column];


                    if (
                        value === undefined ||
                        value === null ||
                        String(value).trim() === ""
                    ) {

                        missingValues++;

                    }

                }
            );

        }
    );


    // ============================
    // Duplicate Rows
    // ============================

    const uniqueRows =
        new Set(
            data.map(
                row =>
                    JSON.stringify(row)
            )
        );


    const duplicateRows =
        rows -
        uniqueRows.size;


    // ============================
    // Column Types
    // ============================

    const numericColumns = [];

    const categoricalColumns = [];


    columnNames.forEach(
        column => {

            const values =
                data
                    .map(
                        row =>
                            row[column]
                    )
                    .filter(
                        value =>
                            value !== undefined &&
                            value !== null &&
                            String(value).trim() !== ""
                    );


            const numeric =
                values.length > 0 &&
                values.every(
                    value =>
                        !isNaN(
                            Number(value)
                        )
                );


            if (numeric) {

                numericColumns.push(
                    column
                );

            }

            else {

                categoricalColumns.push(
                    column
                );

            }

        }
    );


    // ============================
    // Statistics
    // ============================

    const statistics = {};


    numericColumns.forEach(
        column => {

            const values =
                data
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


            const mean =
                calculateMean(
                    values
                );


            const median =
                calculateMedian(
                    values
                );


            const minimum =
                Math.min(
                    ...values
                );


            const maximum =
                Math.max(
                    ...values
                );


            const standardDeviation =
                calculateStandardDeviation(
                    values,
                    mean
                );


            statistics[column] = {

                mean:
                    Number(
                        mean.toFixed(2)
                    ),

                median:
                    Number(
                        median.toFixed(2)
                    ),

                minimum,

                maximum,

                standardDeviation:
                    Number(
                        standardDeviation.toFixed(2)
                    )

            };

        }
    );


    return {

        rows,

        columns,

        columnNames,

        missingValues,

        duplicateRows,

        numericColumns,

        categoricalColumns,

        statistics,

        preview:
            data.slice(0, 10),

        data

    };

}


module.exports = {
    readCSV,
    analyzeData
};