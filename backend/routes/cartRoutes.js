const express = require("express");
const router = express.Router();
const { query } = require("../config/db");
const auth = require("../middleware/auth");

// add
router.post("/add", auth, async (req, res) => {
    const { item_id, item_type } = req.body;
    const userId = req.user.userId;

    const result = await query(
        "SELECT * FROM cart_items WHERE item_id = $1 AND item_type = $2 AND user_id = $3",
        [item_id, item_type, userId]
    );

    if (result.rows.length > 0) {
        await query(
            "UPDATE cart_items SET quantity = quantity + 1 WHERE item_id = $1 AND item_type = $2 AND user_id = $3",
            [item_id, item_type, userId]
        );
    } else {
        await query(
            "INSERT INTO cart_items (item_id, item_type, quantity, user_id) VALUES ($1, $2, 1, $3)",
            [item_id, item_type, userId]
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
            c.quantity,
            c.item_type
        FROM cart_items c
        JOIN food_items f ON c.item_id = f.food_id
        WHERE c.user_id = $1 AND c.item_type = 'food'

        UNION ALL

        SELECT 
            c.id,
            p.name,
            p.price,
            c.quantity,
            c.item_type
        FROM cart_items c
        JOIN products p ON c.item_id = p.id
        WHERE c.user_id = $1 AND c.item_type = 'product'

        UNION ALL

        SELECT 
            c.id,
            m.title AS name,
            s.ticket_price AS price,
            c.quantity,
            c.item_type
        FROM cart_items c
        JOIN showtimes s ON c.item_id = s.showtime_id
        JOIN movies m ON s.movie_id = m.movie_id
        WHERE c.user_id = $1 AND c.item_type = 'ticket'
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