const express = require("express");
const router = express.Router();
const { query } = require("../config/db");
const auth = require("../middleware/auth");

// add
router.post("/add", auth, async (req, res) => {
    const { item_id } = req.body;
    const userId = req.user.userId;

    const result = await query(
        "SELECT * FROM cart_items WHERE item_id = $1 AND user_id = $2",
        [item_id, userId]
    );

    if (result.rows.length > 0) {
        await query(
            "UPDATE cart_items SET quantity = quantity + 1 WHERE item_id = $1 AND user_id = $2",
            [item_id, userId]
        );
    } else {
        await query(
            "INSERT INTO cart_items (item_id, quantity, user_id) VALUES ($1, 1, $2)",
            [item_id, userId]
        );
    }

    res.json({ message: "added" });
});


// get cart
router.get("/", auth, async (req, res) => {
    const userId = req.user.userId;

    const result = await query(`
        SELECT 
            c.id,
            f.name,
            f.price,
            c.quantity
        FROM cart_items c
        JOIN food_items f ON c.item_id = f.food_id
        WHERE c.user_id = $1
    `, [userId]);

    res.json(result.rows);
});


// delete
router.delete("/:id", auth, async (req, res) => {
    const userId = req.user.userId;

    await query(
        "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
        [req.params.id, userId]
    );

    res.json({ message: "deleted" });
});

//increase
router.post("/increase/:id", auth, async (req, res) => {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    await query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id = $1 AND user_id = $2",
        [cartItemId, userId]
    );

    res.json({ message: "increased" });
});

//decrease
router.post("/decrease/:id", auth, async (req, res) => {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    // check number
    const result = await query(
        "SELECT quantity FROM cart_items WHERE id = $1 AND user_id = $2",
        [cartItemId, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "not found" });
    }

    const qty = result.rows[0].quantity;

    if (qty <= 1) {
        // if just one → delete
        await query(
            "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
            [cartItemId, userId]
        );
    } else {
        await query(
            "UPDATE cart_items SET quantity = quantity - 1 WHERE id = $1 AND user_id = $2",
            [cartItemId, userId]
        );
    }

    res.json({ message: "decreased" });
});

module.exports = router;