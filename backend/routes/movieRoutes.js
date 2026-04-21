const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// now showing
router.get("/now-showing", async (req, res) => {
    const result = await query(
        "SELECT * FROM movies WHERE status = $1",
        ["now_showing"]
    );
    res.json(result.rows);
});

// upcoming
router.get("/upcoming", async (req, res) => {
    const result = await query(
        "SELECT * FROM movies WHERE status = $1",
        ["upcoming"]
    );
    res.json(result.rows);
});

// movie detail
router.get("/:id", async (req, res) => {
    const result = await query(
        "SELECT * FROM movies WHERE movie_id = $1",
        [req.params.id]
    );

    res.json(result.rows[0]);
});

// showtimes
router.get("/:id/showtimes", async (req, res) => {
    const result = await query(`
        SELECT s.*, h.name AS hall_name
        FROM showtimes s
        JOIN halls h ON h.hall_id = s.hall_id
        WHERE s.movie_id = $1
    `, [req.params.id]);

    res.json(result.rows);
});

module.exports = router;