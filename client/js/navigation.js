/* =========================================
   INSIGHTFLOW
   NAVIGATION
========================================= */


const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");



// =========================================
// MOBILE MENU
// =========================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle(
                "active"
            );


            const isOpen =
                navLinks.classList.contains(
                    "active"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );


            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );


            menuToggle.textContent =
                isOpen ? "✕" : "☰";

        }
    );

}



// =========================================
// CLOSE MENU AFTER CLICKING A LINK
// =========================================

if (navLinks) {

    const links =
        navLinks.querySelectorAll(
            ".nav-link"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 768
                    ) {

                        navLinks.classList.remove(
                            "active"
                        );


                        if (menuToggle) {

                            menuToggle.textContent =
                                "☰";

                            menuToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            menuToggle.setAttribute(
                                "aria-label",
                                "Open navigation menu"
                            );

                        }

                    }

                }
            );

        }
    );

}



// =========================================
// CLOSE MENU WHEN SCREEN GETS BIGGER
// =========================================

window.addEventListener(
    "resize",
    function () {

        if (
            window.innerWidth > 768
        ) {

            if (navLinks) {

                navLinks.classList.remove(
                    "active"
                );

            }


            if (menuToggle) {

                menuToggle.textContent =
                    "☰";

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    }
);