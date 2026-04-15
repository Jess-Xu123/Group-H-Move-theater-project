const express = require("express");
const router = express.Router();
const db = require("../config/db");

// get foods
router.get("/", async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM food_items ORDER BY name"
    );

    res.json(rows);
});

module.exports = router;