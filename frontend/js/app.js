const API_URL = 'http://localhost:3000/api';

// fetch online store items data
async function loadStoreItems() {
    try {
        const response = await fetch(`${API_URL}/store/store-items`);
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
        const response = await fetch(`${API_URL}/event/event-schedule`);
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

function renderCalendar(events) {
    const eventList = document.getElementById('eventList');
    if(!eventList) return;

    eventList.className = "row g-4";

    eventList.innerHTML = events.map(event => `
        <div class="col-md-6 col-lg-4">
           <div class="event-card-fancy">
            <div class="event-header">
                <span class="event-date">${new Date(event.event_date).toLocaleDateString()}</span>
                </div>
                <h3 class="event-title">${event.name}</h3>

                <p class="event-time mb-3">
                <i class="bi bi-clock"></i> ${event.start_time.substring(0,5)}
                </p>

                <div class="d-flex justify-content-between align-items-center">
                    <span class="slots-text">Slots: ${event.available_slots} left</span>
                    
                    <button class="book-btn" 
                            ${event.available_slots <= 0 ? 'disabled' : ''} 
                            onclick="openBookingModal(${event.id}, '${event.name}')">
                        ${event.available_slots <= 0 ? 'Full' : 'Book Now'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.openBookingModal = (id, name) => {
    const modalEl = document.getElementById('bookingModal');
    if (!modalEl) return;
    
    document.getElementById('selectedScheduleId').value = id;
    document.getElementById('modalEventName').innerText = `Book: ${name}`;
    
    // 初始化 Bootstrap 模态框并显示
    const myModal = new bootstrap.Modal(modalEl);
    myModal.show();
};

window.confirmBooking = async () => {
    const scheduleId = document.getElementById('selectedScheduleId').value;
    const email = document.getElementById('userEmail').value;

    if (!email) return alert("Please enter email");

    try {
        const response = await fetch(`${API_URL}/event/book-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduleId, email })
        });
        
        const result = await response.json();
        if (result.success) {
            alert("Booking Confirmed!");
            location.reload(); 
        }
    } catch (err) {
        alert("Booking failed");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadStoreItems();
    loadEvents();
});


// SIDE MENU TOGGLE
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    const openBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('menuClose');

    if (!menu || !overlay || !openBtn || !closeBtn) return;

    // Open menu
    openBtn.addEventListener('click', () => {
        menu.classList.add('active');
        overlay.classList.add('active');
    });

    // Close menu
    closeBtn.addEventListener('click', () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Click on the background to close menu
    overlay.addEventListener('click', () => {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    });
});

function updateSummary(data) {
    let subtotal = 0;

    data.forEach(item => {
        subtotal += Number(item.price) * Number(item.quantity);
    });

    let vat = subtotal * 0.1;
    let total = subtotal + vat;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2) + " €";
    document.getElementById("vat").innerText = vat.toFixed(2) + " €";
    document.getElementById("totalPrice").innerText = total.toFixed(2) + " €";
}

function loadCart() {
    fetch("/api/cart")
        .then(res => res.json())
        .then(data => {
            console.log("CART:", data);

            const container = document.getElementById("cartItemsContainer");

            if (data.length === 0) {
                updateSummary([]);
                document.getElementById("emptyCartMessage").classList.remove("d-none");
                return;
            }

            if (!container) {
                console.error("container not found!");
                return;
            }

            container.innerHTML = "";

            data.forEach(item => {
                container.innerHTML += `
                <div class="cart-item-card d-flex align-items-center mb-3" data-id="${item.id}">

                    <div class="item-info flex-grow-1">
                        <h5 class="text-gold fw-bold">${item.name}</h5>
                        <span class="badge bg-secondary mt-1">Food</span>
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
                `;
            });

            updateSummary(data);
        });
}

document.addEventListener("DOMContentLoaded", loadCart);

document.getElementById("cartItemsContainer")
.addEventListener("click", function (e) {

    const icon = e.target.closest(".bi-trash3");
    if (!icon) return;

    const card = icon.closest(".cart-item-card");
    const id = card.dataset.id;

    fetch(`/api/cart/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => loadCart());
});