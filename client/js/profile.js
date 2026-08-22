// ==========================================
// GET USER DATA
// ==========================================

const userData =
    localStorage.getItem("user");

const token =
    localStorage.getItem("token");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !userData) {

    window.location.href =
        "login.html";

}


// ==========================================
// DISPLAY USER
// ==========================================

try {

    const user =
        JSON.parse(userData);


    document.getElementById(
        "profileName"
    ).textContent =
        user.name || "User";


    document.getElementById(
        "userName"
    ).textContent =
        user.name || "Not available";


    document.getElementById(
        "userEmail"
    ).textContent =
        user.email || "Not available";

}

catch (error) {

    console.error(
        "Unable to load user data:",
        error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href =
        "login.html";

}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


logoutButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

    }
);