import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js'; // <-- con .js
import ventasRoutes from './routes/ventas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5501',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public')); //Para ver la imagenes en el front
app.use(cookieParser());

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/usuarios', usuariosRoutes);

console.log('scripts_vendedor.js cargado correctamente');

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});