const fs = require("fs");
const Papa = require("papaparse");

/* ==========================================
   BASIC HELPERS
========================================== */

function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
}

function toNumber(value) {
    if (isEmpty(value)) {
        return null;
    }

    const number = Number(
        String(value).replace(/,/g, "").trim()
    );

    return Number.isNaN(number) ? null : number;
}


/* ==========================================
   COLUMN TYPE DETECTION
========================================== */

function detectColumnTypes(rows, columns) {

    const numericColumns = [];
    const categoricalColumns = [];

    columns.forEach(column => {

        const values = rows
            .map(row => row[column])
            .filter(value => !isEmpty(value));

        if (values.length === 0) {
            categoricalColumns.push(column);
            return;
        }

        const numericValues = values.filter(
            value => toNumber(value) !== null
        );

        const numericRatio =
            numericValues.length / values.length;

        if (numericRatio >= 0.8) {
            numericColumns.push(column);
        } else {
            categoricalColumns.push(column);
        }
    });

    return {
        numericColumns,
        categoricalColumns
    };
}


/* ==========================================
   COLUMN PROFILE
========================================== */

function createColumnProfile(rows, columns) {

    return columns.map(column => {

        const values = rows
            .map(row => row[column])
            .filter(value => !isEmpty(value));

        const missing =
            rows.length - values.length;

        const unique =
            new Set(values.map(String)).size;

        return {
            name: column,
            totalValues: rows.length,
            missingValues: missing,
            uniqueValues: unique,
            completeness: Number(
                (
                    ((rows.length - missing) /
                        rows.length) *
                    100
                ).toFixed(2)
            )
        };
    });
}


/* ==========================================
   STATISTICS
========================================== */

function calculateStatistics(rows, columns) {

    const statistics = {};

    columns.forEach(column => {

        const values = rows
            .map(row => toNumber(row[column]))
            .filter(value => value !== null)
            .sort((a, b) => a - b);

        if (values.length === 0) {
            return;
        }

        const sum = values.reduce(
            (total, value) => total + value,
            0
        );

        const mean = sum / values.length;

        const middle =
            Math.floor(values.length / 2);

        let median;

        if (values.length % 2 === 0) {
            median =
                (values[middle - 1] +
                    values[middle]) / 2;
        } else {
            median = values[middle];
        }

        const variance =
            values.reduce(
                (total, value) =>
                    total +
                    Math.pow(value - mean, 2),
                0
            ) / values.length;

        const standardDeviation =
            Math.sqrt(variance);

        statistics[column] = {
            count: values.length,
            mean: Number(mean.toFixed(2)),
            median: Number(median.toFixed(2)),
            minimum: values[0],
            maximum: values[values.length - 1],
            standardDeviation:
                Number(standardDeviation.toFixed(2))
        };
    });

    return statistics;
}


/* ==========================================
   OUTLIER DETECTION
   IQR METHOD
========================================== */

function calculateOutliers(rows, columns) {

    const result = {};

    columns.forEach(column => {

        const values = rows
            .map(row => toNumber(row[column]))
            .filter(value => value !== null)
            .sort((a, b) => a - b);

        if (values.length < 4) {
            result[column] = {
                count: 0,
                percentage: 0,
                lowerBound: null,
                upperBound: null
            };

            return;
        }

        const q1Index =
            Math.floor((values.length - 1) * 0.25);

        const q3Index =
            Math.floor((values.length - 1) * 0.75);

        const q1 = values[q1Index];
        const q3 = values[q3Index];

        const iqr = q3 - q1;

        const lowerBound =
            q1 - 1.5 * iqr;

        const upperBound =
            q3 + 1.5 * iqr;

        const outlierCount =
            values.filter(
                value =>
                    value < lowerBound ||
                    value > upperBound
            ).length;

        result[column] = {
            count: outlierCount,
            percentage: Number(
                (
                    (outlierCount / values.length) *
                    100
                ).toFixed(2)
            ),
            lowerBound:
                Number(lowerBound.toFixed(2)),
            upperBound:
                Number(upperBound.toFixed(2))
        };
    });

    return result;
}


/* ==========================================
   CORRELATION
   PEARSON METHOD
========================================== */

function calculateCorrelation(
    rows,
    columnA,
    columnB
) {

    const pairs = rows
        .map(row => ({
            x: toNumber(row[columnA]),
            y: toNumber(row[columnB])
        }))
        .filter(
            pair =>
                pair.x !== null &&
                pair.y !== null
        );

    if (pairs.length < 2) {
        return null;
    }

    const xMean =
        pairs.reduce(
            (sum, pair) => sum + pair.x,
            0
        ) / pairs.length;

    const yMean =
        pairs.reduce(
            (sum, pair) => sum + pair.y,
            0
        ) / pairs.length;

    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    pairs.forEach(pair => {

        const xDifference =
            pair.x - xMean;

        const yDifference =
            pair.y - yMean;

        numerator +=
            xDifference * yDifference;

        xDenominator +=
            Math.pow(xDifference, 2);

        yDenominator +=
            Math.pow(yDifference, 2);
    });

    const denominator =
        Math.sqrt(
            xDenominator * yDenominator
        );

    if (denominator === 0) {
        return null;
    }

    return Number(
        (numerator / denominator).toFixed(4)
    );
}


/* ==========================================
   CORRELATION MATRIX
========================================== */

function createCorrelationMatrix(
    rows,
    numericColumns
) {

    const matrix = {};

    numericColumns.forEach(columnA => {

        matrix[columnA] = {};

        numericColumns.forEach(columnB => {

            if (columnA === columnB) {

                matrix[columnA][columnB] = 1;

            } else {

                matrix[columnA][columnB] =
                    calculateCorrelation(
                        rows,
                        columnA,
                        columnB
                    );
            }
        });
    });

    return matrix;
}


/* ==========================================
   DATA QUALITY
========================================== */

function calculateDataQuality(
    rows,
    columns,
    profile
) {

    const totalCells =
        rows.length * columns.length;

    const missingValues =
        profile.reduce(
            (sum, column) =>
                sum + column.missingValues,
            0
        );

    const completeness =
        totalCells === 0
            ? 100
            : (
                (
                    totalCells -
                    missingValues
                ) /
                totalCells
            ) * 100;

    const uniqueRows =
        new Set(
            rows.map(row => JSON.stringify(row))
        ).size;

    const duplicateRows =
        rows.length - uniqueRows;

    const uniqueness =
        rows.length === 0
            ? 100
            : (uniqueRows / rows.length) * 100;

    const validity =
        rows.length === 0
            ? 100
            : Math.max(
                0,
                100 -
                (
                    duplicateRows /
                    rows.length
                ) *
                100
            );

    const score =
        (
            completeness +
            uniqueness +
            validity
        ) / 3;

    return {
        score: Number(score.toFixed(2)),
        completeness:
            Number(completeness.toFixed(2)),
        uniqueness:
            Number(uniqueness.toFixed(2)),
        validity:
            Number(validity.toFixed(2)),
        missingValues,
        duplicateRows
    };
}


/* ==========================================
   CHART RECOMMENDATIONS
========================================== */

function createChartRecommendations(
    numericColumns,
    categoricalColumns
) {

    const recommendations = [];

    if (
        numericColumns.length >= 2
    ) {

        recommendations.push({
            chart: "Scatter Plot",
            columns: [
                numericColumns[0],
                numericColumns[1]
            ],
            reason:
                "Useful for identifying relationships between two numerical variables."
        });
    }

    if (
        numericColumns.length >= 1
    ) {

        recommendations.push({
            chart: "Histogram",
            columns: [
                numericColumns[0]
            ],
            reason:
                "Useful for understanding the distribution of numerical values."
        });
    }

    if (
        categoricalColumns.length >= 1 &&
        numericColumns.length >= 1
    ) {

        recommendations.push({
            chart: "Bar Chart",
            columns: [
                categoricalColumns[0],
                numericColumns[0]
            ],
            reason:
                "Useful for comparing numerical values across categories."
        });
    }

    if (
        categoricalColumns.length >= 1
    ) {

        recommendations.push({
            chart: "Pie Chart",
            columns: [
                categoricalColumns[0]
            ],
            reason:
                "Useful for visualizing category distribution."
        });
    }

    return recommendations;
}


/* ==========================================
   INSIGHT GENERATION
========================================== */

function generateInsights(
    statistics,
    outliers,
    quality
) {

    const insights = [];

    Object.entries(statistics)
        .forEach(([column, stats]) => {

            insights.push(
                `${column} has an average value of ${stats.mean} and ranges from ${stats.minimum} to ${stats.maximum}.`
            );
        });


    Object.entries(outliers)
        .forEach(([column, result]) => {

            if (result.count > 0) {

                insights.push(
                    `${column} contains ${result.count} potential outlier value(s).`
                );
            }
        });


    if (quality.missingValues > 0) {

        insights.push(
            `The dataset contains ${quality.missingValues} missing value(s) that may require cleaning.`
        );
    }


    if (quality.duplicateRows > 0) {

        insights.push(
            `The dataset contains ${quality.duplicateRows} duplicate row(s).`
        );
    }


    return insights;
}


/* ==========================================
   MAIN ANALYSIS FUNCTION
========================================== */

async function analyzeData(
    filePath
) {

    const csvText =
        fs.readFileSync(
            filePath,
            "utf8"
        );

    const parsed =
        Papa.parse(
            csvText,
            {
                header: true,
                skipEmptyLines: true
            }
        );

    if (parsed.errors.length > 0) {

        throw new Error(
            "Unable to parse CSV file."
        );
    }

    const rows =
        parsed.data;

    const columns =
        parsed.meta.fields || [];


    if (
        rows.length === 0 ||
        columns.length === 0
    ) {

        throw new Error(
            "Dataset is empty."
        );
    }


    const {
        numericColumns,
        categoricalColumns
    } =
        detectColumnTypes(
            rows,
            columns
        );


    const profile =
        createColumnProfile(
            rows,
            columns
        );


    const statistics =
        calculateStatistics(
            rows,
            numericColumns
        );


    const outliers =
        calculateOutliers(
            rows,
            numericColumns
        );


    const correlations =
        createCorrelationMatrix(
            rows,
            numericColumns
        );


    const quality =
        calculateDataQuality(
            rows,
            columns,
            profile
        );


    const chartRecommendations =
        createChartRecommendations(
            numericColumns,
            categoricalColumns
        );


    const insights =
        generateInsights(
            statistics,
            outliers,
            quality
        );


    return {

        fileName:
            filePath.split(/[/\\]/).pop(),

        rows:
            rows.length,

        columns:
            columns.length,

        columnNames:
            columns,

        numericColumns,

        categoricalColumns,

        profile,

        quality,

        statistics,

        outliers,

        correlations,

        chartRecommendations,

        insights,

        preview:
            rows.slice(0, 10)
    };
}
module.exports = {
    analyzeData
};