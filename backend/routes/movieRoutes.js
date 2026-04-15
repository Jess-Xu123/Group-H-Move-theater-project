const express = require("express");
const router = express.Router();
const db = require("../config/db");

// now showing
router.get("/now-showing", async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM movies WHERE status = ?",
        ["now_showing"]
    );
    res.json(rows);
});

// upcoming
router.get("/upcoming", async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM movies WHERE status = ?",
        ["upcoming"]
    );
    res.json(rows);
});

// movie detail
router.get("/:id", async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM movies WHERE movie_id = ?",
        [req.params.id]
    );

    res.json(rows[0]);
});

// showtimes
router.get("/:id/showtimes", async (req, res) => {
    const [rows] = await db.query(`
        SELECT s.*, h.name AS hall_name
        FROM showtimes s
        JOIN halls h ON h.hall_id = s.hall_id
        WHERE s.movie_id = ?
    `, [req.params.id]);

    res.json(rows);
});

module.exports = router;