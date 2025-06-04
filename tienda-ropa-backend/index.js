import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js'; // <-- con .js
import ventasRoutes from './routes/ventas.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); //Para ver la imagenes en el front

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

console.log('scripts_vendedor.js cargado correctamente');

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});