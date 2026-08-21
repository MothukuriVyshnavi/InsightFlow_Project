const API_BASE_URL = "/api";


async function apiRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            options
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Request failed."
        );

    }


    return data;

}


async function analyzeDataset(file) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    return await apiRequest(
        "/analyze",
        {
            method: "POST",
            body: formData
        }
    );

}


async function getDashboardSummary() {

    return await apiRequest(
        "/dashboard/summary"
    );

}


export {
    apiRequest,
    analyzeDataset,
    getDashboardSummary
};