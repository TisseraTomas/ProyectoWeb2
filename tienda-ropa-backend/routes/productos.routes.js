import express from 'express';
import conn from '../db/conn.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';

const router = express.Router()
// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer: almacenamiento temporal
const upload = multer({ dest: 'uploads/' }); // sube a carpeta temporal

// Ruta para agregar un producto
router.post('/agregar', upload.single('imagen'), async (req, res) => {
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
router.get('/:codigo', async (req, res) => {
  const codigo = req.params.codigo;
  try {
    const [results] = await conn.query('SELECT * FROM productos WHERE codigo_barras = ?', [codigo]);
    if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar producto' });
  }
});

// Ruta para vender producto (descontar stock)
router.post('/ventas/vender', async (req, res) => {
  const { codigo_barras, cantidad = 1 } = req.body;

  try {
    const [results] = await conn.query('SELECT * FROM productos WHERE codigo_barras = ?', [codigo_barras]);
    if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const producto = results[0];

    if (producto.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Registrar la venta
    await conn.query(
      `INSERT INTO ventas (producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?)`,
      [producto.id, cantidad, producto.precio]
    );

    if (producto.stock === cantidad) {
      await conn.query('DELETE FROM productos WHERE codigo_barras = ?', [codigo_barras]);
      return res.json({ mensaje: `Producto vendido y eliminado (${cantidad} unidad/es)` });
    } else {
      await conn.query('UPDATE productos SET stock = stock - ? WHERE codigo_barras = ?', [cantidad, codigo_barras]);
      return res.json({ mensaje: `Producto vendido: ${cantidad} unidad/es` });
    }
    

  } catch (err) {
    console.error('Error en la venta:', err);
    res.status(500).json({ error: 'Error en la operación de venta' });
  }
});

//Trae todos los productos con fecha de creacion
router.get('/mostrar/catalogo', async (req, res) => {
  try {
    const [productos] = await conn.query('SELECT * FROM productos');

    const productosConFlag = productos.map(p => {
      const fecha = new Date(p.fecha_creacion);
      const ahora = new Date();
      const esNuevo = (ahora - fecha) <= 7 * 24 * 60 * 60 * 1000; // últimos 7 días
      return { ...p, esNuevo };
    });

    res.json(productosConFlag);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Trae solo los productos nuevos (últimos 7 días)
router.get('/mostrar/catalogo/nuevos', async (req, res) => {
  try {
    const [productos] = await conn.query('SELECT * FROM productos');

    const ahora = new Date();
    const productosNuevos = productos.filter(p => {
      const fecha = new Date(p.fecha_creacion);
      return (ahora - fecha) <= 7 * 24 * 60 * 60 * 1000; // últimos 7 días
    });

    // Agregamos el flag esNuevo como true explícitamente
    const productosConFlag = productosNuevos.map(p => ({ ...p, esNuevo: true }));

    res.json(productosConFlag);
  } catch (err) {
    console.error('Error al obtener productos nuevos:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

//Trae todos los productos
router.get('/', async (req, res) => {
  try {
    const [results] = await conn.query('SELECT * FROM productos');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

//Eliminar producto
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await conn.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Obtener un producto por ID
router.get('/id/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await conn.query('SELECT * FROM productos WHERE id = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error.message, error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
    /*console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });*/
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    nombre,
    categoria,
    precio,
    stock,
    codigo_barras,
    talla,
    color
  } = req.body;

  try {
    const [result] = await conn.query(
      `UPDATE productos 
       SET nombre = ?, categoria = ?, precio = ?, stock = ?, 
           codigo_barras = ?, talla = ?, color = ?
       WHERE id = ?`,
      [nombre, categoria, precio, stock, codigo_barras, talla, color, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
});

export default router;
