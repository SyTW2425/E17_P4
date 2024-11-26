const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // modelo usuarios backend
const router = express.Router();

// Endpoint de registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        newUser.markModified('users');
        newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario.', error });
    }
});

module.exports = router;
