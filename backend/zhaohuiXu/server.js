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