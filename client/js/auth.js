const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const authMessage =
    document.getElementById("authMessage");


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message, success = false) {

    if (!authMessage) return;

    authMessage.style.display = "block";

    authMessage.textContent = message;

    if (success) {

        authMessage.style.background = "#d1fae5";
        authMessage.style.color = "#065f46";

    } else {

        authMessage.style.background = "#fee2e2";
        authMessage.style.color = "#991b1b";

    }

}


// ==========================================
// SIGN UP
// ==========================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5500/api/auth/signup",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name,
                                email,
                                password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showMessage(
                        data.message ||
                        "Signup failed."
                    );

                    return;

                }


                showMessage(
                    "Account created successfully!",
                    true
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);

            }

            catch (error) {

                console.error(error);

                showMessage(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;


            try {

                const response =
                    await fetch(
                        "http://localhost:5500/api/auth/login",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email,
                                password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showMessage(
                        data.message ||
                        "Invalid email or password."
                    );

                    return;

                }


                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                showMessage(
                    "Login successful!",
                    true
                );


                setTimeout(() => {

                    window.location.href =
                        "profile.html";

                }, 1000);

            }

            catch (error) {

                console.error(error);

                showMessage(
                    "Unable to connect to the server."
                );

            }

        }
    );

}