const API_URL_Z = '/api';

window.onload = async () => {

const bodyId = document.body.id;

if(bodyId === "register-page"){
    // send email code（just a test for now
    document.getElementById("send-code-btn").addEventListener("click", () => {
        const email = document.getElementById("reg-email").value.trim();
        if (!email || !email.includes("@")) {
            alert("please input a real email");
            return;
        };
        
        // for backend to send to email
        alert("code has send to " + email);

        // random code in frontend（test
        window.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("code (for test):", window.generatedCode);
    });

    // create account
    document.getElementById("create-account-btn").addEventListener("click", async () => {
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-password-confirm").value;
    const code = document.getElementById("reg-verification-code").value.trim();

    if (!username || !email || !password || !confirmPassword || !code) {
        alert("please fill all the info");
        return;
    }

    if (password !== confirmPassword) {
        alert("passwords are different");
        return;
    }

    if (code !== window.generatedCode) {
        alert("wrong code");
        return;
    }

    try {
        const res = await fetch(`${API_URL_Z}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (data.code === 0) {
            alert("successful register, please login");
            window.location.href = "/Login.html";
        } else {
            alert("register fail: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("request fail, check backend");
    }
    });
}

else if(bodyId === "login-page"){
    const loginButton = document.getElementById("login-btn");
    //login
    loginButton.onclick = async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // check
    if (!username || !password) {
        alert("please input the username and password");
        return;
    }

    try {
        const res = await fetch(`${API_URL_Z}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.code === 0) {
            alert("successful login");

            localStorage.setItem("token", data.token);

            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);

            const accountTitle = document.getElementById("account-username");
            if (accountTitle) accountTitle.textContent = data.username;

            window.location.href = "/accountZ.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("request fail, check backend");
    }
    }
}

else if(bodyId === "account-page"){
    const token = localStorage.getItem("token");

    const profileForm = document.getElementById("profile-form");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const accountTitle = document.getElementById("account-username");

    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (accountTitle) accountTitle.textContent = storedUsername;

    // insert default info
    usernameInput.value = storedUsername || "Guest";
    emailInput.value = storedEmail || "guest@example.com";

    if (!token) {
        console.log("not login, use default info");
        document.querySelector("#profile-form button").disabled = true;
        return;
    }

    // if has token
    try {
        const res = await fetch(`${API_URL_Z}/users/userinfo`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (data.code === 0) {
            usernameInput.value = data.data.username;
            emailInput.value = data.data.email;

            localStorage.setItem("username", data.data.username);
            localStorage.setItem("email", data.data.email);
        } else {
            console.log("token is invaild or user does not exists, keep default");
        }
    } catch (err) {
        console.error("get userinfo error", err);
    }

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        if (username.length < 3) {
            alert("Username must be at least 3 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to save changes");
            return;
        }

        const updatedUser = {
            username: usernameInput.value,
            email: emailInput.value
        };

        try {
            const res = await fetch("${API_URL_Z}/users/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(updatedUser)
            });

            const data = await res.json();
            if (data.code === 0) {
                alert("Profile updated successfully!");

                localStorage.setItem("username", usernameInput.value);
                localStorage.setItem("email", emailInput.value);

                const accountTitle = document.getElementById("account-username");
                if (accountTitle) accountTitle.textContent = data.username;
            } else {
                alert("Update failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    });

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
                case "discount":
                    html = document.querySelector("main .card:nth-child(4)").outerHTML;
                    break;
                case "favorites":
                    html = document.querySelector("main .card:nth-child(5)").outerHTML;
                    break;
                case "wallet":
                    html = document.querySelector("main .card:nth-child(6)").outerHTML;
                    break;
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
    else if(bodyId === "cart-page"){

    }

};