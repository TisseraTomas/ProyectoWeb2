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
      producto_padre_id,
      categoria,
      precio,
      stock,
      codigo_barras,
      talla,
      color
    } = req.body;

    let imagen = 'default.jpg';

    if (req.file) {
      const nombreFinal = `producto-${Date.now()}.jpg`;
      const rutaDestino = path.join(__dirname, '../public/img/', nombreFinal);

      await sharp(req.file.path)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toFile(rutaDestino);

      fs.unlinkSync(req.file.path);
      imagen = nombreFinal;
    }

    const sql = `
      INSERT INTO productos 
      (nombre, producto_padre_id, categoria, precio, stock, codigo_barras, talla, color, imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await conn.query(sql, [
      nombre,
      producto_padre_id,
      categoria,
      precio,
      stock,
      codigo_barras,
      talla,
      color,
      imagen
    ]);

    return res.status(200).json({
      mensaje: 'Producto agregado correctamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error en /agregar:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ese código de barras ya existe.' });
    }

    return res.status(500).json({ error: 'Error interno del servidor.' });
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

// Obtener variantes agrupadas por talle y color para un producto padre
router.get('/grupo/:producto_padre_id', async (req, res) => {
  const padreId = req.params.producto_padre_id;

  try {
    const [variantes] = await conn.query(`
      SELECT id, nombre, talla, color, imagen, stock, precio
      FROM productos
      WHERE producto_padre_id = ?
    `, [padreId]);

    if (variantes.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron variantes para este producto' });
    }

    // Tomar el nombre común desde la primera variante
    const nombreBase = variantes[0].nombre;

    // Agrupar por talle y color
    const resultado = {
      nombre: nombreBase,
      variantes: {}
    };

    variantes.forEach(prod => {
      if (!resultado.variantes[prod.talla]) {
        resultado.variantes[prod.talla] = {};
      }

      resultado.variantes[prod.talla][prod.color] = {
        id: prod.id,
        imagen: prod.imagen,
        stock: prod.stock,
        precio: prod.precio
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener grupo de productos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// Actualizar un producto (con imagen opcional)
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const id = req.params.id;
  const {
    nombre,
    categoria,
    precio,
    stock,
    codigo_barras,
    talla,
    color,
    producto_padre_id
  } = req.body;

  try {
    // Obtener imagen actual
    const [productos] = await conn.query('SELECT imagen FROM productos WHERE id = ?', [id]);
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    let imagen = productos[0].imagen;

    // Si se envía nueva imagen, procesarla
    if (req.file) {
      const nombreFinal = `producto-${Date.now()}.jpg`;
      const rutaDestino = path.join(__dirname, '../public/img/', nombreFinal);

      await sharp(req.file.path)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toFile(rutaDestino);

      fs.unlinkSync(req.file.path);

      // Eliminar imagen anterior (si no es la default)
      if (imagen && imagen !== 'default.jpg') {
        const rutaAnterior = path.join(__dirname, '../public/img/', imagen);
        if (fs.existsSync(rutaAnterior)) {
          fs.unlinkSync(rutaAnterior);
        }
      }

      imagen = nombreFinal;
    }

    // Actualizar datos en la BD
    const [result] = await conn.query(
      `UPDATE productos 
       SET nombre = ?, categoria = ?, precio = ?, stock = ?, 
           codigo_barras = ?, talla = ?, color = ?, producto_padre_id = ?, imagen = ?
       WHERE id = ?`,
      [nombre, categoria, precio, stock, codigo_barras, talla, color, producto_padre_id, imagen, id]
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

// // Ruta temporal para crear un admin (BORRAR después de usar)
// router.post('/crear-admin', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await conn.query('INSERT INTO admin (email, contraseña) VALUES (?, ?)', [email, hashedPassword]);

//     res.json({ mensaje: 'Administrador creado correctamente' });
//   } catch (error) {
//     console.error('Error al crear admin:', error);
//     res.status(500).json({ mensaje: 'Error al crear admin' });
//   }
// });

export default router;
