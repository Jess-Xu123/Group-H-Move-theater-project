const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// get foods
router.get("/", async (req, res) => {
  const category = req.query.category;

  let sql = "SELECT * FROM food_items";
  let params = [];

  if (category) {
    sql += " WHERE category = $1";
    params.push(category);
  }

  sql += " ORDER BY name";

  try{
    const result = await query(sql, params);
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;