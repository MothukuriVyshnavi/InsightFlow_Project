document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname.split("/").pop();

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href")
                .split("/")
                .pop();


        if (linkPage === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

});