const express = require('express');
const router = express.Router();

module.exports = (pool) => {

// GET: All items
    router.get('/store-items', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM products ORDER BY id');
            res.json(result.rows);
        } catch(err) {
            res.status(500).json({ error: err.message});
        }
    });

// GET: 1 item
    router.get('/store-items/:id', async (req, res) => {
        const {id} = req.params;
        try {
            const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            if (result.rowCount === 0) 
                return res.status(404).json({ error: "Item not found"});
            res.json(result.rows[0]);
            }catch(err) {
            res.status(500).json({ error: err.message});
        }   
    });

// POST: Add new item
    router.post('/store-items', async (req, res) => {
        const { name, category, price, description } = req.body;
        try {
            const result = await pool.query(
            'INSERT INTO products (name, category, price, description) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, category, price, description]);

            res.status(201).json(result.rows[0]);
        } catch(err) {
            res.status(500).json({ error: err.message});
        }
    });

// PUT: Update item information
    router.put('/store-items/:id', async (req, res) => {
        const { id } = req.params;
        const { name, category, price, description } = req.body;
        try {
            const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, price = $3, description = $4 WHERE id = $5 RETURNING *', 
            [name, category, price, description, id]);

            if(result.rowCount === 0)
                return res.status(404).json({error: "Item not found"});
            res.json(result.rows[0]);    
        } catch(err) {
            res.status(500).json({ error: err.message});
        }
    });

// DELETE: Delete item
    router.delete('/store-items/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query(
            'DELETE FROM products WHERE id = $1', [id]);

            if(result.rowCount === 0)
                return res.status(404).json({error: "Item not found"});
            res.json({message: "Item deleted successfully"});    
        } catch(err) {
            res.status(500).json({ error: err.message});
        }
    });

    return router;
}