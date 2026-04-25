import { API_URL_Z, getToken } from "./core.js";

export function addToCart(id, type, quantity = 1) {
    const token = getToken();

    if (!token) {
        alert("please login first");
        return;
    }

    const safeQuantity = Math.max(1, Number(quantity) || 1);

    console.log("ADD TO CART CLICK:", { id, type, quantity: safeQuantity });

    if (!id || !type) {
        console.error("INVALID ADD TO CART DATA", { id, type, quantity: safeQuantity });
        alert("Add to cart failed: missing data");
        return;
    }

    fetch(`${API_URL_Z}/cart/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ item_id: id, item_type: type, quantity: safeQuantity
})
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            alert("login expired, please login again");
            return;
        }
        return res.json();
    })
    .then(data => {
        if (data?.message === "added") {
            alert("Added to cart");
        }
    });
}