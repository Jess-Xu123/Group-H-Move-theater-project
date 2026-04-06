const API_URL = 'http://localhost:3000/api'



// fetch online store items data
async function loadStoreItems() {
    try {
        const response = await fetch(`${API_URL}/store-items`);
        if (! response.ok) throw new Error ('Network connection down');

        const items = await response.json();
        renderStore(items);
    } catch(error) {
        console.error('Fetching store items data failed', error);
    }
}

// fetch event data 
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/event-schedule`);
        const events = await response.json();
        renderCalendar(events);
    } catch(error) {
        console.error('Fetching event data failed', error);
    }
}


   
function renderStore(items) {
    const storeContainer = document.getElementById('store-container');
    if (!storeContainer) return;

    storeContainer.innerHTML = items.map(item => `
        <div class="card">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">${item.price} €</div>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    loadStoreItems();
    loadEvents();
});