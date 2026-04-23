import { API_URL_Z, getToken } from "./core.js";

export function initCart() {
    loadCart();

    const container = document.getElementById("cartItemsContainer");
    if (!container) return;

    container.addEventListener("click", handleCartClick);
}

function loadCart() {
    fetch(`${API_URL_Z}/cart`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    .then(res => res.json())
    .then(renderCart);
}

function renderCart(data) {
    const container = document.getElementById("cartItemsContainer");
    if (!container) return;

    container.innerHTML = data.map(item => `
                <div class="cart-item-card d-flex align-items-center mb-3" data-id="${item.id}">

                    <div class="item-info flex-grow-1">
                        <h5 class="text-gold fw-bold">${item.name}</h5>
                        <span class="badge bg-secondary mt-1">
                            ${item.item_type === "food" ? "Food" : "Store"}
                        </span>
                    </div>

                    <div class="item-price-qty d-flex align-items-center gap-4">

                        <span class="price">${item.price} €</span>

                        <div class="qty-control d-flex align-items-center gap-2">
                            <i class="bi bi-dash-circle"></i>
                            <span class="qty-num">${item.quantity}</span>
                            <i class="bi bi-plus-circle"></i>
                        </div>

                        <i class="bi bi-trash3 text-danger"></i>
                    </div>

                </div>
    `).join("");

    updateSummary(data);
}

function handleCartClick(e) {
    const token = getToken();

    const card = e.target.closest(".cart-item-card");
    if (!card) return;

    const id = card.dataset.id;

    //  add
    if (e.target.closest(".bi-plus-circle")) {
        fetch(`${API_URL_Z}/cart/increase/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }).then(loadCart);
    }

    //  minus
    if (e.target.closest(".bi-dash-circle")) {
        fetch(`${API_URL_Z}/cart/decrease/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }).then(loadCart);
    }

    //  delete
    if (e.target.closest(".bi-trash3")) {
        fetch(`${API_URL_Z}/cart/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(loadCart);
    }
}

function updateSummary(data) {
    let subtotal = 0;

    data.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    const subEl = document.getElementById("subtotal");
    const vatEl = document.getElementById("vat");
    const totalEl = document.getElementById("totalPrice");

    if (subEl) subEl.innerText = subtotal.toFixed(2);
    if (vatEl) vatEl.innerText = vat.toFixed(2);
    if (totalEl) totalEl.innerText = total.toFixed(2);
}