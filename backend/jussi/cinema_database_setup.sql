BEGIN;

-- Drop in dependency-safe order
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.showtimes;
DROP TABLE IF EXISTS public.halls;
DROP TABLE IF EXISTS public.food_items;
DROP TABLE IF EXISTS public.movies;


-- Create tables
CREATE TABLE public.movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration_min INTEGER,
    age_rating VARCHAR(10),
    release_date DATE,
    status VARCHAR(50)
);

CREATE TABLE public.halls (
    hall_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE public.showtimes (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES public.movies(movie_id),
    hall_id INTEGER NOT NULL REFERENCES public.halls(hall_id),
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    format VARCHAR(20) NOT NULL,
    language VARCHAR(20) NOT NULL
);

CREATE TABLE public.bookings (
    booking_id SERIAL PRIMARY KEY,
    showtime_id INTEGER NOT NULL REFERENCES public.showtimes(showtime_id),
    customer_name VARCHAR(100),
    customer_email VARCHAR(255) NOT NULL,
    ticket_count INTEGER NOT NULL CHECK (ticket_count > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.food_items (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(6,2) NOT NULL,
    category VARCHAR(20) NOT NULL
);

-- Seed movies
INSERT INTO public.movies (
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

-- Seed halls
INSERT INTO public.halls (
    name,
    capacity
)
VALUES
    ('Hall 1', 120),
    ('Hall 2', 90),
    ('Hall 3', 60);

-- Seed showtimes
INSERT INTO public.showtimes (
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
INSERT INTO public.food_items (
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

COMMIT;
