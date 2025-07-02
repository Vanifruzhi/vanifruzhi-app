const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Importar rutas
const authRoute = require('./routes/auth');

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middlewares
app.use(cors()); // Permite peticiones desde otros dominios
app.use(express.json()); // Permite al servidor entender JSON

// Usar rutas
app.use('/api/auth', authRoute); // Todas las rutas en auth.js empezarán con /api/auth

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('El backend de VanifruzhiApp está funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});