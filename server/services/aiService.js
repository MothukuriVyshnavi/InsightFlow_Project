async function explainData(analysis) {

    /*
        AI integration will be added here.

        The analysis object contains:

        - rows
        - columns
        - missingValues
        - duplicateRows
        - numericColumns
        - categoricalColumns
        - statistics
    */


    const explanation = `

Your dataset contains ${analysis.rows} rows
and ${analysis.columns} columns.

There are ${analysis.missingValues}
missing values and
${analysis.duplicateRows} duplicate rows.

Numeric columns:
${analysis.numericColumns.join(", ") || "None"}

Categorical columns:
${analysis.categoricalColumns.join(", ") || "None"}

The AI explanation module will provide
more detailed insights once the AI API
is connected.

`;


    return explanation.trim();

}


module.exports = {
    explainData
};