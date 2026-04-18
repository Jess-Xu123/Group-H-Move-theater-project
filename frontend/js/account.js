import { API_URL_Z, getToken, getUser, setUser } from "./core.js";

export function initAccount() {

    const user = getUser();

    const title = document.getElementById("account-username");
    const emailText = document.querySelector(".text-muted");

    if (title) title.textContent = user.username || "Guest";
    if (emailText) emailText.textContent = user.email || "guest@example.com";
    
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");

    if (usernameInput) usernameInput.value = user.username;
    if (emailInput) emailInput.value = user.email;

    // update profile
    const form = document.getElementById("profile-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const res = await fetch(`${API_URL_Z}/users/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getToken()
                },
                body: JSON.stringify({
                    username: usernameInput.value,
                    email: emailInput.value
                })
            });

            const data = await res.json();

            if (data.code === 0) {
                setUser({
                    token: getToken(),
                    username: usernameInput.value,
                    email: emailInput.value
                });

                alert("updated");
            }
        });
    }

    initMobileSidebar();
}

function initMobileSidebar() {
    //for mobile content
    const mobileContent = document.getElementById("mobile-content");
    const navLinks = document.querySelectorAll(".sidebar .nav-link");

    function isMobile() {
        return window.innerWidth < 768;
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            if (!isMobile()) return;

            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const section = link.dataset.section;

            let html = "";
            switch (section) {
                case "profile":
                    html = document.querySelector("main .card:nth-child(1)").outerHTML;
                    break;
                case "tickets":
                    html = document.querySelector("main .card:nth-child(2)").outerHTML;
                    break;
                case "food":
                    html = document.querySelector("main .card:nth-child(3)").outerHTML;
                    break;
                case "wallet":
                    html = document.querySelector("main .card:nth-child(4)").outerHTML;
                    break;
                case "favorites":
                    html = document.querySelector("main .card:nth-child(5)").outerHTML;
                    break;
                // case "logout":
                //     html = document.querySelector("main .card:nth-child(6)").outerHTML;
                //     break;
            }

            mobileContent.innerHTML = html;

            // change input
            const usernameInput = mobileContent.querySelector("#username");
            const emailInput = mobileContent.querySelector("#email");
            const accountTitle = mobileContent.querySelector("#account-username");

            const username = localStorage.getItem("username") || "Guest";
            const email = localStorage.getItem("email") || "guest@example.com";

            if (usernameInput) usernameInput.value = username;
            if (emailInput) emailInput.value = email;
            if (accountTitle) accountTitle.textContent = username;

            mobileContent.scrollIntoView({ behavior: "smooth" });
        });
    });

    window.addEventListener("resize", () => {
        if (!isMobile()) {
            mobileContent.innerHTML = "";
        }
    });
}