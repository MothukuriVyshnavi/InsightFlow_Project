const API_URL =
    "http://localhost:5000/api";


export async function uploadDataset(file) {

    const formData =
        new FormData();

    formData.append(
        "dataset",
        file
    );


    const response =
        await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",
                body: formData
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to upload dataset."
        );

    }


    return data;

}


export async function getAIExplanation(
    analysis
) {

    const response =
        await fetch(
            `${API_URL}/ai/explain`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        analysis
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "AI analysis failed."
        );

    }


    return data;

}