const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'movie_theater_db',
    password: '000123',
    port: 5432,
});

pool.query('SELECT NOW()', (err,res) => {
    if(err) {
        console.error('Database connection error: ', err.message);
    } else {
        console.log('Database connected! Server time: ', res.rows[0].now);
    }
});

// Movie date example
/* 
const movies = [
    {id: 1, title: "Interstella", genre: "Sci-Fi"},
    {id: 2, title: "The Dark Knight", genre: "Action"},
    {id: 3, title: "Inception", genre: "Sci-Fi"},
];

app.get('/api/movies', (req, res) => {
    res.json(movies);
});
*/

app.get('/api/store-items', async (req,res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database query failed" });
    }
})

app.get('/api/event-schedule', async(req,res) => {
    try {
        const result = await pool.query ( `
            SELECT s.id, t.name, s.event_date, s.start_time, s.available_slots, s.is_special_event 
            FROM event_schedule s
            JOIN event_types t ON s.event_type_id = t.id
            ORDER BY s.event_date ASC
            `);
            res.json(result.rows);}

            catch(err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to fetch schedule' })
            }
});

app.post( '/api/book-event', async (req, res) => {
    const { scheduleId, email} = red.body;
    try {
        await pool.query (
            'INSERT INTO event_bookings (schedule_id, user_email) VALUES ($1, $2)',
            [scheduleId, email]
        );
        await pool.query (
            'UPDATE event_schedule SET available_slots = available_slots - 1 WHERE id = $1',
            [scheduleId]
        );
        res.json({ success: true, message: "Booking confirmed!"});
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
});