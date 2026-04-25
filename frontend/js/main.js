import { initLogin, initRegister, initNavbar, initLogout } from "./auth.js";
import { initAccount } from "./account.js";
import { initCart } from "./cart.js";
import { initUI } from "./ui.js";
import { initEvents } from "./event.js"
import { initStore } from "./store.js"
import { addToCart } from "./cartService.js";

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
            break;

        case "event-page":
            initEvents();
            break;
    }


    // For homepage, movie now shown
    const movieGrid = document.getElementById('movie-now-shown');
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();

    function formatReleaseDate(releaseDate) {
        const date = new Date(releaseDate);
        return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
        });
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart-btn");
        if (!btn) return;

        const id = btn.dataset.id;
        const type = btn.dataset.type;

        addToCart(id, type);
    });
    
    if (movieGrid && (currentPage === 'homescreenx.html' || currentPage === '')) {
        console.log("You are now at homepage, loading movies");
        
        const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:8080/api"
            : "https://move-theater-project-api.onrender.com/api";

        fetch(`${API_URL}/movies/now-showing`)
            .then(res => res.json())
            .then(movies => {
            movieGrid.innerHTML = movies.map(movie => `
                <div class="col-6 col-md-4 col-lg-2 px-1">
                <a href="movieDetailsJ.html?id=${movie.movie_id}" class="movie-link text-decoration-none">
                    <article class="movie-card">
                        <img src="${movie.poster_url}" alt="${movie.title} poster" class="movie-poster img-fluid">
                        <h2 class="movie-title mt-2">${movie.title}</h2>
                        <p class="movie-time mb-0" style="font-size: 0.8rem; color: #bbb;">
                        In theaters ${formatReleaseDate(movie.release_date)}
                        </p>
                    </article>
                </a>
            </div>
            `).join('');
            })
            .catch(err => console.error(err)); 
        }
});
