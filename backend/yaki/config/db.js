const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1529sql",
    database: "users_system"
});

db.connect(err => {
    if (err) {
        console.log("connect fail:", err);
    } else {
        console.log("connect success");
    }
});

module.exports = db;