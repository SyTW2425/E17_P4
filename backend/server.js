// Importacion de las dependencias principales
const express = require('express'); //framework para contruir el servidor
const mongoose = require('mongoose'); //base de datos
const cors = require('cors'); //solicitudes desde frontend
const bcrypt = require('bcrypt'); //encriptar contraseñas
const jwt = require('jsonwebtoken'); //manejar tokers jwt
require('dotenv').config(); // se cargan variables de entorno desde .env

// Inicializa la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permitir solicitudes desde diferentes orígenes
app.use(express.json()); // Para analizar JSON en las solicitudes

// Conexión a MongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/inventoryApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Definición de rutas (esto viene después de la conexión)
const User = require('./models/User');

// Ruta para registrar un usuario
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save(); // Guarda el usuario en la base de datos
    res.status(201).json({ message: 'Usuario registrado', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Busca el usuario en la base de datos
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
