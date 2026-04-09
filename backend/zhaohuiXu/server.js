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

const storeRoutes = require('./routes/storeRoutes')(pool);
const eventRoutes = require('./routes/eventRoutes')(pool);

app.use('/api', storeRoutes);
app.use('/api', eventRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
});


// Movie menu example
const nowShowingMovies = [
    { movie_id: 1, title: "Batman", genre: "Action, Drama", category: "now-showing" },
    { movie_id: 2, title: "Inception", genre: "Sci-Fi, Thriller", category: "now-showing" },
    { movie_id: 3, title: "Interstellar", genre: "Sci-Fi, Adventure", category: "now-showing" },
    { movie_id: 4, title: "Spiderman", genre: "Action, Sci-Fi", category: "now-showing" },
    { movie_id: 5, title: "Harry Potter", genre: "Sci-Fi, Adventure", category: "now-showing" }
];

const upcomingMovies = [
    { movie_id: 1, title: "Batman", genre: "Action, Drama", category: "now-showing" },
    { movie_id: 2, title: "Inception", genre: "Sci-Fi, Thriller", category: "now-showing" },
    { movie_id: 3, title: "Interstellar", genre: "Sci-Fi, Adventure", category: "now-showing" },
    { movie_id: 4, title: "Spiderman", genre: "Action, Sci-Fi", category: "now-showing" },
    { movie_id: 5, title: "Harry Potter", genre: "Sci-Fi, Adventure", category: "now-showing" }
];

app.get('/api/movies/now-showing', (req, res) => {
    res.json(nowShowingMovies);
});
app.get('/api/movies/upcoming', (req, res) => {
    res.json(upcomingMovies);
});

