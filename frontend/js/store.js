import { API_URL_Z, getToken } from "./core.js";

export async function initStore() {
    const res = await fetch(`${API_URL_Z}/store/store-items`);
    const items = await res.json();

    renderStore(items);
}

function renderStore(items) {

    const ticketGrid = document.getElementById("ticket-grid");
    const upgradeGrid = document.getElementById("upgrade-grid");
    const giftGrid = document.getElementById("gift-grid");

    if (!ticketGrid || !upgradeGrid || !giftGrid) return;

    ticketGrid.innerHTML = "";
    upgradeGrid.innerHTML = "";
    giftGrid.innerHTML = "";

    items.forEach(item => {

        const card = `
            <div class="store-card" onclick="addToCart(${item.id})">
                <div class="img"></div>
                <p>${item.name}</p>
            </div>
        `;

        switch (item.category) {

            case "serial":
                ticketGrid.innerHTML += card;
                break;

            case "premium":
                upgradeGrid.innerHTML += card;
                break;

            case "gift":
                giftGrid.innerHTML += card;
                break;
        }
    });
}