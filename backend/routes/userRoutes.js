const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const { query } = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const SECRET_KEY = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !email || !password) {
            return res.json({ code: 1, message: "please fill all information" });
        }
        const result = await query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (result.rows.length > 0) {
            const existing = result.rows[0]

            if (existing.username === username) {
                return res.json({ code: 1, message: "username already exists" });
            }

            if (existing.email === email) {
                return res.json({ code: 1, message: "email already exists" });
            }
        }

        const hashedPassword = await hashPassword(password);

        await query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
            [username, hashedPassword, email]
        );

        res.json({ code: 0, message: "register success" });

    } catch (err) {
        console.error(err);
        res.json({ code: 1, message: "register fail" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, username]
        );
        if (result.rows.length === 0) {
            return res.json({ code: 1, message: "user does not exist" });
        }

        const user = result.rows[0];
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.json({ code: 1, message: "wrong password" });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            code: 0,
            message: "login success",
            token,
            userId: user.id,
            username: user.username,
            email: user.email
        });

    } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ code: 1, message: err.message });
    }
});

// get userinfo（need token
router.get("/userinfo", auth, async (req, res) => {
    try {
        const result = await query(
            "SELECT username, email FROM users WHERE id = $1",
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ code: 1, message: "user not found" });
        }

        res.json({
            code: 0,
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, message: "server error" });
    }
});

router.post("/update", auth, async (req, res) => {
    try {
        const { username, email } = req.body;

        await query(
            "UPDATE users SET username = $1, email = $2 WHERE id = $3",
            [username, email, req.user.userId]
        );

        res.json({ code: 0, message: "update success" });

    } catch (err) {
        console.error(err);
        res.json({ code: 1, message: "update failed" });
    }
});

module.exports = router;