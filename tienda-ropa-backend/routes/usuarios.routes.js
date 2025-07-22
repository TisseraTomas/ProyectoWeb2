import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import conn from '../db/conn.js';
import cookieParser from 'cookie-parser';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Middleware para validar el token
function verificarToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No autenticado' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido o expirado' });
        req.usuario = decoded;
        next();
    });
}

// Registrar
router.post('/register', async (req, res) => {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

    if (!esEmailValido(email)) {
        return res.status(400).json({ error: 'Email no válido' });
    }

    if (contraseña.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const hashed = await bcrypt.hash(contraseña, 10);
    try {
        await conn.query(
            'INSERT INTO usuarios (email, contraseña) VALUES (?, ?)',
            [email, hashed]
        );
        res.json({ mensaje: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'El usuario ya existe' });
        } else {
            res.status(500).json({ error: 'Error al registrar' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    const [results] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (results.length === 0) return res.status(400).json({ error: 'Usuario/contraseña incorrectos' });

    const usuario = results[0];
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!coincide) return res.status(400).json({ error: 'Usuario/contraseña incorrectos' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true en prod
        maxAge: 3600000,
        sameSite: 'lax'
    });

    res.json({ mensaje: 'Login correcto' });
});

// Perfil
router.get('/perfil', verificarToken, async (req, res) => {
    const [results] = await conn.query('SELECT id, email, nombre, apellido, direccion, telefono FROM usuarios WHERE id = ?', [req.usuario.id]);
    res.json(results[0]);
});

router.put('/perfil', verificarToken, async (req, res) => {
  const { nombre, apellido, telefono, direccion } = req.body;
  try {
    await conn.query(`
      UPDATE usuarios SET nombre=?, apellido=?, telefono=?, direccion=?
      WHERE id=?
    `, [nombre, apellido, telefono, direccion, req.usuario.id]);

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ mensaje: 'Sesión cerrada' });
});


export default router;
