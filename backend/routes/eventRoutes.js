const express = require('express');
const router = express.Router();
const { query } = require("../config/db");

// GET: all current events
router.get('/event-schedule', async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                s.id, 
                t.name, 
                s.event_date, 
                s.start_time, 
                s.available_slots
            FROM event_schedule s
            JOIN event_types t ON s.event_type_id = t.id
            ORDER BY s.event_date ASC
        `);

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- POST: Add new booking ---
router.post('/book-event', async (req, res)=> {
    const {scheduleId, email} = req.body;

// 1. Insert new booking
    try {
        await query(
        'INSERT INTO event_bookings (schedule_id, user_email) VALUES ($1, $2)',
        [scheduleId, email]
    );
// 2. Update event schedule slots

        await query (
            'UPDATE event_schedule SET available_slots = available_slots - 1 WHERE id = $1',
            [scheduleId]
        );

        res.json({ success: true, message: "Booking confirmed!"});}
        catch(err) {
            console.error(err.message);
            res.status(500).json({ error: "Booking failed: " + err.message});
        }
});

// --- PUT: Update booking ---
router.put('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const result = await query(
            'UPDATE event_bookings SET user_email = $1 WHERE id = $2',
            [email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({
            success: true,
            message: "Email updated!"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--- DELETE: Delete booking ---
router.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            'SELECT schedule_id FROM event_bookings WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const scheduleId = result.rows[0].schedule_id;

        await query(
            'DELETE FROM event_bookings WHERE id = $1',
            [id]
        );

        await query(
            'UPDATE event_schedule SET available_slots = available_slots + 1 WHERE id = $1',
            [scheduleId]
        );

        res.json({
            success: true,
            message: "Booking cancelled and slot restored!"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;