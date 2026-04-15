CREATE DATABASE users_system;
USE users_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE event_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2)
);

CREATE TABLE event_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type_id INT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    available_slots INT DEFAULT 1,
    is_special_event TINYINT(1) DEFAULT 0,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);

CREATE TABLE event_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT,
    user_email VARCHAR(255),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES event_schedule(id)
);

CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration_min INT,
    age_rating VARCHAR(10),
    release_date DATE,
    status VARCHAR(50)
);

CREATE TABLE halls (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    hall_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    format VARCHAR(20) NOT NULL,
    language VARCHAR(20) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    showtime_id INT NOT NULL,
    customer_name VARCHAR(100),
    customer_email VARCHAR(255) NOT NULL,
    ticket_count INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
);

CREATE TABLE food_items (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
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
    status
)
VALUES
(
    'Movie 1',
    'Test description for Movie 1.',
    'Action',
    95,
    'K-12',
    '2026-04-01',
    'now_showing'
),
(
    'Movie 2',
    'Test description for Movie 2.',
    'Comedy',
    102,
    'K-7',
    '2026-04-03',
    'upcoming'
),
(
    'Movie 3',
    'Test description for Movie 3.',
    'Drama',
    118,
    'K-12',
    '2026-04-05',
    'now_showing'
),
(
    'Movie 4',
    'Test description for Movie 4.',
    'Sci-Fi',
    130,
    'K-16',
    '2026-04-07',
    'upcoming'
),
(
    'Movie 5',
    'Test description for Movie 5.',
    'Horror',
    99,
    'K-18',
    '2026-04-09',
    'now_showing'
),
(
    'Movie 6',
    'Test description for Movie 6.',
    'Animation',
    88,
    'K-7',
    '2026-04-11',
    'upcoming'
),
(
    'Movie 7',
    'Test description for Movie 7.',
    'Thriller',
    110,
    'K-16',
    '2026-04-13',
    'now_showing'
),
(
    'Movie 8',
    'Test description for Movie 8.',
    'Adventure',
    121,
    'K-12',
    '2026-04-15',
    'upcoming'
),
(
    'Movie 9',
    'Test description for Movie 9.',
    'Fantasy',
    127,
    'K-12',
    '2026-04-17',
    'now_showing'
),
(
    'Movie 10',
    'Test description for Movie 10.',
    'Romance',
    104,
    'K-7',
    '2026-04-19',
    'upcoming'
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
    language
)
VALUES
    (1, 1, '2026-04-01', '18:00', '2D',   'EN'),
    (1, 2, '2026-04-01', '21:00', '2D',   'FI'),

    (2, 1, '2026-04-03', '17:30', '2D',   'FI'),
    (2, 3, '2026-04-03', '20:00', '2D',   'EN'),

    (3, 2, '2026-04-05', '18:15', '2D',   'EN'),
    (3, 1, '2026-04-06', '20:30', '2D',   'FI'),

    (4, 3, '2026-04-07', '19:00', 'IMAX', 'EN'),
    (4, 2, '2026-04-08', '21:15', '2D',   'FI'),

    (5, 1, '2026-04-09', '20:00', '2D',   'EN'),
    (5, 2, '2026-04-09', '22:15', '2D',   'FI'),

    (6, 1, '2026-04-11', '14:00', '2D',   'FI'),
    (6, 2, '2026-04-11', '16:00', '2D',   'EN'),

    (7, 3, '2026-04-13', '19:30', 'IMAX', 'EN'),
    (7, 1, '2026-04-14', '21:00', '2D',   'FI'),

    (8, 2, '2026-04-15', '17:00', '2D',   'EN'),
    (8, 1, '2026-04-16', '19:45', '2D',   'FI'),

    (9, 3, '2026-04-17', '18:30', 'IMAX', 'EN'),
    (9, 2, '2026-04-18', '21:00', '2D',   'FI'),

    (10, 1, '2026-04-19', '17:30', '2D',  'EN'),
    (10, 2, '2026-04-19', '20:00', '2D',  'FI');

-- Seed food items
INSERT INTO food_items (
    name,
    description,
    price,
    category
)
VALUES
    ('Food1', 'Description for Food1', 5.00, 'Food'),
    ('Food2', 'Description for Food2', 6.00, 'Food'),
    ('Food3', 'Description for Food3', 7.00, 'Food'),

    ('Drink1', 'Description for Drink1', 3.00, 'Drinks'),
    ('Drink2', 'Description for Drink2', 4.00, 'Drinks'),
    ('Drink3', 'Description for Drink3', 5.00, 'Drinks'),

    ('Snack1', 'Description for Snack1', 2.50, 'Snacks'),
    ('Snack2', 'Description for Snack2', 3.50, 'Snacks'),
    ('Snack3', 'Description for Snack3', 4.50, 'Snacks'),

    ('Other1', 'Description for Other1', 1.50, 'Others'),
    ('Other2', 'Description for Other2', 2.50, 'Others'),
    ('Other3', 'Description for Other3', 3.50, 'Others');


INSERT INTO event_types (name, description, base_price) VALUES 
('Birthday Movie', 'Celebrate your special day', 150.00),
('Special Movie Week', 'Exclusive screenings', 15.00);

INSERT INTO event_schedule (event_type_id, event_date, start_time, available_slots, is_special_event) VALUES 
(1, '2026-08-10', '18:00:00', 1, FALSE), 
(1, '2026-08-12', '14:00:00', 0, FALSE), 
(2, '2026-08-15', '19:30:00', 50, TRUE), 
(2, '2026-08-16', '19:30:00', 50, TRUE);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1
);