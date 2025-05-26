import express from 'express';
const router = express.Router();
import conn from '../db/conn.js';

const multer = require('multer');
const path = require('path');

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'producto-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// GET todos los productos
router.get('/', (req, res) => {
  conn.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Ruta para agregar un producto
router.post('/api/productos/agregar', upload.single('imagen'), (req, res) => {
  const {
    nombre,
    categoria,
    precio,
    stock,
    codigo_barras,
    talla,
    color
  } = req.body;

  // Si no se subió imagen, usar una por defecto
  const imagen = req.file ? req.file.filename : 'default.jpg';

  const sql = `
    INSERT INTO productos 
    (nombre, categoria, precio, stock, codigo_barras, talla, color, imagen) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  conn.query(sql, [nombre, categoria, precio, stock, codigo_barras, talla, color, imagen], (err, result) => {
    if (err) {
      console.error('Error al insertar producto:', err);
      return res.status(500).json({ error: 'Error al insertar producto' });
    }
    res.json({ mensaje: 'Producto agregado correctamente', id: result.insertId });
  });
});


// Ruta para buscar producto por código de barras
router.get('/api/productos/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const sql = 'SELECT * FROM productos WHERE codigo_barras = ?';
  conn.query(sql, [codigo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar producto' });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// Ruta para vender producto (descontar stock)
router.post('/api/ventas/vender', (req, res) => {
  const { codigo_barras } = req.body;
  const sqlSelect = 'SELECT * FROM productos WHERE codigo_barras = ?';
  conn.query(sqlSelect, [codigo_barras], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const producto = results[0];
    if (producto.stock <= 1) {
      const sqlDelete = 'DELETE FROM productos WHERE codigo_barras = ?';
      conn.query(sqlDelete, [codigo_barras], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
        return res.json({ mensaje: 'Producto vendido y eliminado (última unidad)' });
      });
    } else {
      const sqlUpdate = 'UPDATE productos SET stock = stock - 1 WHERE codigo_barras = ?';
      conn.query(sqlUpdate, [codigo_barras], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar stock' });
        return res.json({ mensaje: 'Producto vendido y stock actualizado' });
      });
    }
  });
});

export default router;