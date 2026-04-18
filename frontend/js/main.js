import { initLogin, initRegister, initNavbar, initLogout } from "./auth.js";
import { initAccount } from "./account.js";
import { initCart } from "./cart.js";
import { initUI } from "./ui.js";
import { initEvents } from "./event.js"
import { initStore } from "./store.js"

document.addEventListener("DOMContentLoaded", () => {

    const page = document.body.id;

    // for every page
    initNavbar();
    initUI();

    switch (page) {

        case "login-page":
            initLogin();
            break;

        case "register-page":
            initRegister();
            break;

        case "account-page":
            initAccount();
            initLogout();
            break;

        case "cart-page":
            initCart();
            break;
        
        case "store-page":
            initStore();

        case "event-page":
            initEvents();
    }
});