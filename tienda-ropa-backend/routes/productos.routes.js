import express from 'express';
import conn from '../db/conn.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';

const router = express.Router();

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer: almacenamiento temporal
const upload = multer({ dest: 'uploads/' }); // sube a carpeta temporal

// Ruta para agregar un producto
router.post('/api/productos/agregar', upload.single('imagen'), async (req, res) => {
  try {
    const {
      nombre,
      categoria,
      precio,
      stock,
      codigo_barras,
      talla,
      color
    } = req.body;

    let imagen = 'default.jpg';

    // Si se subió imagen
    if (req.file) {
      const nombreFinal = `producto-${Date.now()}.jpg`;
      const rutaDestino = path.join(__dirname, '../public/img/', nombreFinal);

      // Convertir a .jpg y guardar en carpeta final
      await sharp(req.file.path)
        .resize({ width: 800 }) // opcional: redimensionar
        .jpeg({ quality: 80 })
        .toFile(rutaDestino);

      fs.unlinkSync(req.file.path); // eliminar archivo temporal

      imagen = nombreFinal;
    }

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
  } catch (error) {
    console.error('Error en el procesamiento de imagen:', error);
    res.status(500).json({ error: 'Error procesando imagen' });
  }
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