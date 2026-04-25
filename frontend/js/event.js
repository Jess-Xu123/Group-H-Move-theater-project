import { getEvents, bookEvent } from "./core.js";

function renderCalendar(events) {
    const eventList = document.getElementById('eventList');
    if(!eventList) return;

    eventList.className = "row g-4";

    eventList.innerHTML = events.map(event => `
        <div class="col-md-6 col-lg-4">
           <div class="event-card-fancy">

                <div class="event-header">
                    <span class="event-date">
                        ${new Date(event.event_date).toLocaleDateString()}
                    </span>
                </div>

                <h3 class="event-title">${event.name}</h3>
                <p class="event-description">
                     ${event.description || 'No description available.'}
                </p>

                <p class="event-time mb-3">
                    <i class="bi bi-clock"></i>
                    ${event.start_time.substring(0,5)}
                </p>

                <div class="d-flex justify-content-between align-items-center">

                    <span class="slots-text">
                        Slots: ${event.available_slots} left
                    </span>

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

export async function initEvents() {
    const events = await getEvents();
    renderCalendar(events);
}


window.openBookingModal = (id, name) => {

    document.getElementById("selectedScheduleId").value = id;
    document.getElementById("modalEventName").innerText = `Book Event: ${name}`;
    
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
};

window.confirmBooking = async () => {
    const token = localStorage.getItem("token"); 
    const scheduleId = document.getElementById("selectedScheduleId").value;
    const email = document.getElementById("userEmail").value;

    if (!email) {
        alert("Please enter your email!");
        return;
    }

    try {
        const res = await bookEvent({ scheduleId, email }, token);
        const data = await res.json();

        if (data.success) {
            alert("Booking Successful!");
            location.reload(); 
        } else {
            alert("Error: " + (data.message || "Failed to book"));
        }
    } catch (error) {
        console.error("Booking error:", error);
        alert("Network error, please try again.");
    }
};
