export const API_URL_Z = '/api';

// ===== USER =====
export function getToken() {
    return localStorage.getItem("token");
}

export function setUser(user) {
    localStorage.setItem("token", user.token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("email", user.email);
    localStorage.setItem("userId", user.userId);
}

export function clearUser() {
    localStorage.clear();
}

export function getUser() {
    return {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        userId: localStorage.getItem("userId")
    };
}

//event
export async function getStoreItems() {
    const res = await fetch(`${API_URL_Z}/store/store-items`);
    return res.json();
}

export async function getEvents() {
    const res = await fetch(`${API_URL_Z}/event/event-schedule`);
    return res.json();
}

export async function bookEvent(data, token) {
    return fetch(`${API_URL_Z}/event/book-event`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
}