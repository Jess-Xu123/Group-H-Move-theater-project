const express = require("express");
const router = express.Router();
const db = require("../config/db");

// get foods
router.get("/", async (req, res) => {
  const category = req.query.category;

  let sql = "SELECT * FROM food_items";
  let params = [];

  if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " ORDER BY name";

  const [rows] = await db.query(sql, params);
  res.json(rows);
});

module.exports = router;