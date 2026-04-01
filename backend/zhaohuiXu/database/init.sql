-- Create Online store table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'serial', 'premium', 'gift'
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);


INSERT INTO products (name, category, price, description) VALUES 
('Serial Tickets 4pcs', 'serial', 54.00, 'Valid 1 year, 13.5€/ticket'),
('Serial Tickets 6pcs', 'serial', 76.00, 'Valid 1 year, 12.7€/ticket'),
('Serial Tickets 8pcs', 'serial', 88.00, 'Valid 1 year, 11€/ticket'),
('IMAX 4pcs', 'premium', 70.00, 'Valid 1 year, 17.5€/ticket'),
('Luxe 4pcs', 'premium', 75.00, 'Valid 1 year, 18.75€/ticket'),
('Premium Luxe 4pcs', 'premium', 80.00, 'Valid 1 year, 20€/ticket'),
('Gift Card 20€', 'gift', 20.00, 'Valid for a year'),
('Gift Card 40€', 'gift', 40.00, 'Valid for a year'),
('Custom Gift Card', 'gift', 0.00, 'Enter any amount');

-- Create Event table
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'Birthday Movie', 'Special Movie Week'
    description TEXT,
    base_price DECIMAL(10, 2)
);

CREATE TABLE event_schedule (
    id SERIAL PRIMARY KEY,
    event_type_id INTEGER REFERENCES event_types(id),
    event_date DATE NOT NULL,          
    start_time TIME NOT NULL,          
    available_slots INTEGER DEFAULT 1, 
    is_special_event BOOLEAN DEFAULT FALSE
);

CREATE TABLE event_bookings (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES event_schedule(id),
    user_email VARCHAR(255),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO event_types (name, description, base_price) VALUES 
('Birthday Movie', 'Celebrate your special day', 150.00),
('Special Movie Week', 'Exclusive screenings', 15.00);

INSERT INTO event_schedule (event_type_id, event_date, start_time, available_slots, is_special_event) VALUES 
(1, '2026-08-10', '18:00:00', 1, FALSE), 
(1, '2026-08-12', '14:00:00', 0, FALSE), 
(2, '2026-08-15', '19:30:00', 50, TRUE), 
(2, '2026-08-16', '19:30:00', 50, TRUE);













