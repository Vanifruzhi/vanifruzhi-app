const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- RUTA DE REGISTRO (ACTUALIZADA) ---
router.post('/register', async (req, res) => {
    try {
        // Verificar si el email o el username ya existen
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }
        const usernameExists = await User.findOne({ username: req.body.username });
        if (usernameExists) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Crear un nuevo usuario (ahora con username)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Guardar el usuario en la base de datos
        await newUser.save();
        res.status(201).json({ message: 'Cuenta creada con éxito.' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// --- RUTA DE LOGIN (ACTUALIZADA) ---
router.post('/login', async (req, res) => {
    try {
        // Permitimos iniciar sesión con email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Verificar si la contraseña es correcta
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Crear y firmar un token de sesión (JWT) con el username
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: `¡Bienvenido/a ${user.username}!`,
            token: token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;
