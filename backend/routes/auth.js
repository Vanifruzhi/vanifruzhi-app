const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    try {
        // 1. Verificar si el email ya existe
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. Crear un nuevo usuario
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // 4. Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito.', userId: savedUser._id });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
    try {
        // 1. Verificar si el usuario existe
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // 2. Verificar si la contraseña es correcta
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // 3. Crear y firmar un token de sesión (JWT)
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload del token
            process.env.JWT_SECRET, // Clave secreta
            { expiresIn: '24h' } // El token expira en 24 horas
        );

        res.status(200).json({ 
            message: `Bienvenido/a ${user.username}`,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;
