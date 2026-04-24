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
    try {
        const result = await query(`
            SELECT
                s.showtime_id,
                s.movie_id,
                s.hall_id,
                s.show_date,
                s.show_time,
                s.format,
                s.language,
                s.ticket_price,
                h.name AS hall_name,
                h.capacity,
                GREATEST(
                    h.capacity - COALESCE(SUM(b.ticket_count), 0),
                    0
                )::int AS slots_left
            FROM showtimes s
            JOIN halls h
                ON h.hall_id = s.hall_id
            LEFT JOIN bookings b
                ON b.showtime_id = s.showtime_id
                AND b.status = 'confirmed'
            WHERE s.movie_id = $1
            GROUP BY
                s.showtime_id,
                s.movie_id,
                s.hall_id,
                s.show_date,
                s.show_time,
                s.format,
                s.language,
                s.ticket_price,
                h.name,
                h.capacity
            ORDER BY
                s.show_date,
                s.show_time
        `, [req.params.id]);

        res.json(result.rows);
    } catch (error) {
        console.error("Showtimes fetch error:", error);
        res.status(500).json({ message: "Failed to load showtimes" });
    }
});

module.exports = router;