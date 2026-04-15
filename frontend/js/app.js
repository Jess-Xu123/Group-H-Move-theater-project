const API_URL = 'http://localhost:3000/api';

// Mock data
if (!localStorage.getItem('cart')) {
    const mockCart = [
        { id: 1, name: "Interstellar - Movie Ticket", price: 15.00, type: "Digital Ticket", qty: 1 },
        { id: 2, name: "Combo XL (Popcorn + Soda)", price: 12.50, type: "Snacks & Drinks", qty: 2 },
        { id: 3, name: "Serial Ticket (5 Movies)", price: 60.00, type: "Special Offer", qty: 1 }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCart));
}

// Shopping cart function
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyMsg.classList.remove('d-none');
        updateSummary(0);
        return;
    }

    emptyMsg.classList.add('d-none');
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item-card d-flex align-items-center mb-3">
            <div class="item-info flex-grow-1">
                <h5 class="text-gold fw-bold">${item.name}</h5>
                <span class="badge bg-secondary mt-1">${item.type}</span>
            </div>
            <div class="item-price-qty d-flex align-items-center gap-4">
                <span class="price">${(item.price * item.qty).toFixed(2)} €</span>
                <div class="qty-control d-flex align-items-center gap-2">
                    <i class="bi bi-dash-circle" onclick="updateQty(${index}, -1)"></i>
                    <span class="qty-num">${item.qty}</span>
                    <i class="bi bi-plus-circle" onclick="updateQty(${index}, 1)"></i>
                </div>
                <i class="bi bi-trash3 text-danger" onclick="removeItem(${index})"></i>
            </div>
        </div>
    `).join('');

    calculateTotal(cart);
}

// Count changes
window.updateQty = function(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].qty += change;
    
    if (cart[index].qty < 1) cart[index].qty = 1; 
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

// Delete items
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

// Cart summary
function calculateTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const vat = subtotal * 0.1; 
    const total = subtotal + vat;

    document.getElementById('subtotal').innerText = `${subtotal.toFixed(2)} €`;
    document.getElementById('vat').innerText = `${vat.toFixed(2)} €`;
    document.getElementById('totalPrice').innerText = `${total.toFixed(2)} €`;
}

document.addEventListener('DOMContentLoaded', renderCart);

// CART checkout
window.simulateCheckout = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    alert("Payment Successful! Your tickets have been sent to your email.");
    localStorage.removeItem('cart'); 
    renderCart();
};


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
        const response = await fetch(`${API_URL}/book-event`, {
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

