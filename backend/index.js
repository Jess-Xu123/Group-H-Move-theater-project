const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

const movies = [
    {id: 1, title: "Interstella", genre: "Sci-Fi"},
    {id: 2, title: "The Dark Knight", genre: "Action"},
    {id: 3, title: "Inception", genre: "Sci-Fi"},
];

app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`);
});