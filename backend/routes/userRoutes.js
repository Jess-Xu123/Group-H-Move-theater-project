const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const db = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const SECRET_KEY = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !email || !password) {
            return res.json({ code: 1, message: "please fill all information" });
        }
        const [results] = await db.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (results.length > 0) {
            const existing = results[0];

            if (existing.username === username) {
                return res.json({ code: 1, message: "username already exists" });
            }

            if (existing.email === email) {
                return res.json({ code: 1, message: "email already exists" });
            }
        }

        const hashedPassword = await hashPassword(password);

        await db.query(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
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
        const [results] = await db.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, username]
        );
        if (results.length === 0) {
            return res.json({ code: 1, message: "user does not exist" });
        }

        const user = results[0];
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
        console.error(err);
        res.json({ code: 1, message: "login fail" });
    }
});

// get userinfo（need token
router.get("/userinfo", auth, async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT username, email FROM users WHERE id = ?",
            [req.user.userId]
        );

        if (results.length === 0) {
            return res.status(404).json({ code: 1, message: "user not found" });
        }

        res.json({
            code: 0,
            data: results[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 1, message: "server error" });
    }
});

router.post("/update", auth, async (req, res) => {
    try {
        const { username, email } = req.body;

        await db.query(
            "UPDATE users SET username = ?, email = ? WHERE id = ?",
            [username, email, req.user.userId]
        );

        res.json({ code: 0, message: "update success" });

    } catch (err) {
        console.error(err);
        res.json({ code: 1, message: "update failed" });
    }
});

module.exports = router;