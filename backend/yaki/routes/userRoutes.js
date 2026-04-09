const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

const SECRET_KEY = "placeholder"; // should be in env

router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

     if (!username || !email || !password) {
        return res.json({ code: 1, message: "please fill all infomation" });
    }
    
    const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkSql, [username, email], async (err, results) => {
        if (err) return res.json({ code: 1, message: "database check fail" });

        if (results.length > 0) {
            // if already exists
            const existing = results[0];
            if (existing.username === username) {
                return res.json({ code: 1, message: "username has already exists" });
            } else if (existing.email === email) {
                return res.json({ code: 1, message: "email has already exists" });
            }
        }

        const hashedPassword = await hashPassword(password);
        const insertSql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        db.query(insertSql, [username, hashedPassword, email], (err, result) => {
            if (err) return res.json({ code: 1, message: "register fail" });

            res.json({ code: 0, message: "register success" });
        });
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(sql, [username,username], async (err, results) => {
        if (err || results.length === 0) return res.send("user does not exists");
        const match = await comparePassword(password, results[0].password);
        if (!match) {
            return res.json({
                code: 1,
                message: "wrong password"
            });
        };

        const user = results[0];
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            SECRET_KEY, 
            { expiresIn: "2h" }
        );

        res.json({
            code: 0,
            message: "login success",
            token,
            username: user.username,
            email: user.email
        });
    });
});

// get userinfo（need token
router.get("/userinfo", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ code: 1, message: "unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ code: 1, message: "invalid token" });

        const sql = "SELECT username, email FROM users WHERE id = ?";
        db.query(sql, [decoded.id], (err, results) => {
            if (err || results.length === 0) return res.status(404).json({ code: 1, message: "user not found" });
            res.json({ code: 0, data: results[0] });
        });
    });
});

router.post("/update", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ code: 1, message: "no token provided" });

    const jwt = require("jsonwebtoken");
    let usernameFromToken;
    try {
        const decoded = jwt.verify(token, "placeholder"); // 用你生成 token 的 secret
        usernameFromToken = decoded.username;
    } catch (err) {
        return res.json({ code: 1, message: "invalid token" });
    }

    const { username, email } = req.body;
    const sql = "UPDATE users SET username = ?, email = ? WHERE username = ?";
    db.query(sql, [username, email, usernameFromToken], (err, result) => {
        if (err) return res.json({ code: 1, message: "database error" });
        res.json({ code: 0, message: "update success" });
    });
});

module.exports = router;