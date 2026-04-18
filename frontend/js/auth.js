import { API_URL_Z } from "./core.js";

export function initRegister() {
    const sendBtn = document.getElementById("send-code-btn");
    const createBtn = document.getElementById("create-account-btn");

    if (!sendBtn || !createBtn) return;

    sendBtn.addEventListener("click", () => {
        const email = document.getElementById("reg-email").value.trim();
        if (!email.includes("@")) return alert("invalid email");

        window.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("code (for test):", window.generatedCode);
        alert("code sent");
    });

    createBtn.addEventListener("click", async () => {
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        const res = await fetch(`${API_URL_Z}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (data.code === 0) {
            alert("success");
            window.location.href = "/loginZ.html";
        }
    });
}

import { setUser } from "./core.js";

export function initLogin() {
    const btn = document.getElementById("login-btn");
    if (!btn) return;

    btn.onclick = async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${API_URL_Z}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.code === 0) {
            setUser(data);
            window.location.href = "/accountZ.html";
        }
    };
}

import { clearUser, getToken } from "./core.js";

export function initNavbar() {
    const userIcon = document.getElementById("userIcon");

    if (userIcon) {
        userIcon.addEventListener("click", () => {
            if (getToken()) {
                window.location.href = "/accountZ.html";
            } else {
                window.location.href = "/loginZ.html";
            }
        });
    }
}

export function initLogout() {
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        if (!confirm("logout?")) return;

        clearUser();
        window.location.href = "/loginZ.html";
    });
}

