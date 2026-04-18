const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// add
router.post("/add", auth, async (req, res) => {
    const { item_id } = req.body;
    const userId = req.user.userId;

    const [rows] = await db.query(
        "SELECT * FROM cart_items WHERE item_id = ? AND user_id = ?",
        [item_id, userId]
    );

    if (rows.length > 0) {
        await db.query(
            "UPDATE cart_items SET quantity = quantity + 1 WHERE item_id = ? AND user_id = ?",
            [item_id, userId]
        );
    } else {
        await db.query(
            "INSERT INTO cart_items (item_id, quantity, user_id) VALUES (?, 1, ?)",
            [item_id, userId]
        );
    }

    res.json({ message: "added" });
});


// get cart
router.get("/", auth, async (req, res) => {
    const userId = req.user.userId;

    const [rows] = await db.query(`
        SELECT 
            c.id,
            f.name,
            f.price,
            c.quantity
        FROM cart_items c
        JOIN food_items f ON c.item_id = f.food_id
        WHERE c.user_id = ?
    `, [userId]);

    res.json(rows);
});


// delete
router.delete("/:id", auth, async (req, res) => {
    const userId = req.user.userId;

    await db.query(
        "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
        [req.params.id, userId]
    );

    res.json({ message: "deleted" });
});

//increase
router.post("/increase/:id", auth, async (req, res) => {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    await db.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ? AND user_id = ?",
        [cartItemId, userId]
    );

    res.json({ message: "increased" });
});

//decrease
router.post("/decrease/:id", auth, async (req, res) => {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    // check number
    const [rows] = await db.query(
        "SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?",
        [cartItemId, userId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: "not found" });
    }

    const qty = rows[0].quantity;

    if (qty <= 1) {
        // if just one → delete
        await db.query(
            "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
            [cartItemId, userId]
        );
    } else {
        await db.query(
            "UPDATE cart_items SET quantity = quantity - 1 WHERE id = ? AND user_id = ?",
            [cartItemId, userId]
        );
    }

    res.json({ message: "decreased" });
});

module.exports = router;