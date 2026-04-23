-- 1. Create Users (AUTO_INCREMENT => SERIAL)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product table (Serial tickets, gift cards)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
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

-- 3. Events table 
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2)
);

CREATE TABLE event_schedule (
    id SERIAL PRIMARY KEY,
    event_type_id INT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    available_slots INT DEFAULT 1,
    is_special_event BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);

CREATE TABLE event_bookings (
    id SERIAL PRIMARY KEY,
    schedule_id INT,
    user_email VARCHAR(255),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES event_schedule(id)
);


-- 4. Movies table 
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration_min INT,
    age_rating VARCHAR(10),
    release_date DATE,
    status VARCHAR(50),
    poster_url VARCHAR(255)
);


-- 5. Halls table 
CREATE TABLE halls (
    hall_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);

-- 6. Showtimes table 
CREATE TABLE showtimes (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    hall_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    format VARCHAR(20) NOT NULL,
    language VARCHAR(20) NOT NULL,
    ticket_price DECIMAL(6,2) NOT NULL DEFAULT 13.50,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    showtime_id INT NOT NULL,
    customer_name VARCHAR(100),
    customer_email VARCHAR(255) NOT NULL,
    ticket_count INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);


-- 7. Foods table 
CREATE TABLE food_items (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2) NOT NULL,
    category VARCHAR(20) NOT NULL
);

INSERT INTO movies (
    title,
    description,
    genre,
    duration_min,
    age_rating,
    release_date,
    status,
    poster_url
)
VALUES
(
    'The Super Mario Galaxy Movie',
    'Mario and Luigi travel beyond the Mushroom Kingdom on a galaxy-spanning adventure to stop a new cosmic threat.',
    'Animation / Adventure / Comedy',
    98,
    'K-7',
    '2026-04-01',
    'now_showing',
    'assets/posters/mario.png'
),
(
    'Project Hail Mary',
    'A lone astronaut wakes up far from Earth and must uncover how to save humanity before time runs out.',
    'Sci-Fi',
    156,
    'K-12',
    '2026-03-20',
    'now_showing',
    'assets/posters/hailmary.png'
),
(
    'You, Me & Tuscany',
    'A romantic mix-up in Italy turns into an unexpected connection in the Tuscan countryside.',
    'Romance / Comedy',
    105,
    'K-7',
    '2026-04-10',
    'now_showing',
    'assets/posters/tuscany.png'
),
(
    'Reminders of Him',
    'A woman released from prison tries to rebuild her life and reconnect with the family she lost.',
    'Romance / Drama',
    114,
    'K-12',
    '2026-03-13',
    'now_showing',
    'assets/posters/remindersofhim.png'
),
(
    'Ready or Not 2: Here I Come',
    'Grace is pulled into another deadly game where survival once again depends on wit, nerve, and luck.',
    'Horror / Comedy / Thriller',
    108,
    'K-16',
    '2026-03-20',
    'now_showing',
    'assets/posters/readyornot.png'
),
(
    'The Odyssey',
    'Odysseus begins his long and dangerous journey home after war, facing mythic dangers across the sea.',
    'Epic Fantasy / Adventure',
    150,
    'K-12',
    '2026-07-17',
    'upcoming',
    'assets/posters/odussey.png'
),
(
    'Dune: Part Three',
    'Paul Atreides faces the consequences of power as the next chapter of the desert saga unfolds.',
    'Sci-Fi / Epic',
    165,
    'K-12',
    '2026-12-18',
    'upcoming',
    'assets/posters/dune.png'
),
(
    'Mother Mary',
    'A global pop icon and a fashion designer reconnect in an intense and emotionally charged drama.',
    'Psychological Drama / Thriller',
    112,
    'K-16',
    '2026-04-24',
    'upcoming',
    'assets/posters/mothermary.png'
),
(
    'Pressure',
    'In the tense days before D-Day, military leaders and forecasters struggle under the weight of one critical decision.',
    'War / Historical Drama',
    100,
    'K-12',
    '2026-05-29',
    'upcoming',
    'assets/posters/pressure.png'
),
(
    'Supergirl',
    'Kara Zor-El takes center stage in DC Studios’ new big-screen superhero adventure.',
    'Action / Adventure',
    127,
    'K',
    '2026-06-26',
    'upcoming',
    'assets/posters/supergirl.png'
);

INSERT INTO halls (
    name,
    capacity
)
VALUES
    ('Hall 1', 120),
    ('Hall 2', 90),
    ('Hall 3', 60);


INSERT INTO showtimes (
    movie_id,
    hall_id,
    show_date,
    show_time,
    format,
    language,
    ticket_price
)
VALUES
    (1, 1, '2026-04-01', '18:00', '2D',   'EN', 13.50),
    (1, 2, '2026-04-01', '21:00', '2D',   'FI', 13.50),

    (2, 1, '2026-04-03', '17:30', '2D',   'FI', 13.50),
    (2, 3, '2026-04-03', '20:00', '2D',   'EN', 13.50),

    (3, 2, '2026-04-05', '18:15', '2D',   'EN', 13.50),
    (3, 1, '2026-04-06', '20:30', '2D',   'FI', 13.50),

    (4, 3, '2026-04-07', '19:00', 'IMAX', 'EN', 17.50),
    (4, 2, '2026-04-08', '21:15', '2D',   'FI', 13.50),

    (5, 1, '2026-04-09', '20:00', '2D',   'EN', 13.50),
    (5, 2, '2026-04-09', '22:15', '2D',   'FI', 13.50),

    (6, 1, '2026-04-11', '14:00', '2D',   'FI', 13.50),
    (6, 2, '2026-04-11', '16:00', '2D',   'EN', 13.50),

    (7, 3, '2026-04-13', '19:30', 'IMAX', 'EN', 17.50),
    (7, 1, '2026-04-14', '21:00', '2D',   'FI', 13.50),

    (8, 2, '2026-04-15', '17:00', '2D',   'EN', 13.50),
    (8, 1, '2026-04-16', '19:45', '2D',   'FI', 13.50),

    (9, 3, '2026-04-17', '18:30', 'IMAX', 'EN', 17.50),
    (9, 2, '2026-04-18', '21:00', '2D',   'FI', 13.50),

    (10, 1, '2026-04-19', '17:30', '2D',  'EN', 13.50),
    (10, 2, '2026-04-19', '20:00', '2D',  'FI', 13.50);

-- Seed food items
INSERT INTO food_items (
    name,
    description,
    price,
    category
)
VALUES
    ('Hot Dog', 'Standard hot dog in a bun.', 6.00, 'Food'),
    ('Hamburger', 'Classic beef hamburger.', 7.00, 'Food'),
    ('Pizza Slice', 'Large slice of pepperoni pizza.', 5.00, 'Food'),

    ('Cola', 'Regular cola fountain drink.', 3.50, 'Drinks'),
    ('Diet Cola', 'Sugar-free cola fountain drink.', 3.50, 'Drinks'),
    ('Water', 'Bottled still water.', 2.50, 'Drinks'),

    ('Popcorn', 'Standard salted popcorn.', 5.00, 'Snacks'),
    ('Peanuts', 'Bag of salted peanuts.', 3.00, 'Snacks'),
    ('Chocolate Bar', 'Milk chocolate bar.', 2.50, 'Snacks'),

    ('Ice Cream', 'Vanilla ice cream cup.', 4.00, 'Others'),
    ('Donut', 'Classic glazed donut.', 2.50, 'Others'),
    ('Muffin', 'Classic blueberry muffin.', 3.00, 'Others');


INSERT INTO event_types (name, description, base_price) VALUES 
('Birthday Movie', 'Celebrate your special day', 150.00),
('Special Movie Week', 'Exclusive screenings', 15.00);

INSERT INTO event_schedule (event_type_id, event_date, start_time, available_slots, is_special_event) VALUES 
(1, '2026-08-10', '18:00:00', 1, FALSE), 
(1, '2026-08-12', '14:00:00', 0, FALSE), 
(2, '2026-08-15', '19:30:00', 50, TRUE), 
(2, '2026-08-16', '19:30:00', 50, TRUE);

-- 8. Carts table 
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    user_id INT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE cart_items ADD COLUMN item_type VARCHAR(20);