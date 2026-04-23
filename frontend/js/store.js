import { API_URL_Z, getToken } from "./core.js";


export async function initStore() {
    try {
        const res = await fetch(`${API_URL_Z}/store/store-items`);
        const items = await res.json();
        renderStore(items);
    } catch (err) {
        console.error("Failed to load store items:", err);
    }
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

        const imagePath = `/assets/onlineStore/${item.category}.png`;
        const defaultImage = '/assets/onlineStore/serialticket.png';

        const card = `
            <div class="store-card">
                <div class="img-container">
                    <img src="${imagePath}" onerror="this.src='${defaultImage}'" alt="${item.name}">
                </div>
                <div class="store-card-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-desc">${item.description || ''}</p>
                    <p class="item-price">${item.price} €</p>
                    <button class="add-to-cart-btn" type="button" data-id="${item.id}" data-type="product">Add</button>
                </div>
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