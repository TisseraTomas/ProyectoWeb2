import express from 'express';
const router = express.Router();
import conn from '../db/conn.js';

// GET todos los productos
router.get('/', (req, res) => {
  conn.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

export default router;