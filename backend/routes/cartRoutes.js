const express = require("express");
const router = express.Router();
const db = require("../config/db");

// add
router.post("/add", async (req, res) => {
    const { item_id } = req.body;

    const [rows] = await db.query(
        "SELECT * FROM cart_items WHERE item_id = ?",
        [item_id]
    );

    if (rows.length > 0) {
        await db.query(
            "UPDATE cart_items SET quantity = quantity + 1 WHERE item_id = ?",
            [item_id]
        );
    } else {
        await db.query(
            "INSERT INTO cart_items (item_id, quantity) VALUES (?, 1)",
            [item_id]
        );
    }

    res.json({ message: "added" });
});


// get cart
router.get("/", async (req, res) => {
    const [rows] = await db.query(`
        SELECT 
            c.id,
            f.name,
            f.price,
            c.quantity
        FROM cart_items c
        JOIN food_items f ON c.item_id = f.food_id
    `);

    res.json(rows);
});


// delete
router.delete("/:id", async (req, res) => {
    await db.query("DELETE FROM cart_items WHERE id = ?", [req.params.id]);
    res.json({ message: "deleted" });
});

module.exports = router;