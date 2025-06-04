import express from 'express';
import conn from '../db/conn.js';

const router = express.Router()

//Trae las ultimas 20 ventas
router.get('/', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT v.id, p.codigo_barras, p.nombre, v.cantidad, v.precio_unitario, v.fecha_venta FROM ventas v JOIN productos p ON v.producto_id = p.id ORDER BY v.fecha_venta DESC LIMIT 20');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

export default router;
