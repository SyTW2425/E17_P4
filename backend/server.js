const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      console.log('Token no proporcionado');
      return res.status(401).json({ message: 'Acceso denegado: Token requerido' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token inválido o expirado:', err.message);
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }
      console.log('Token verificado, usuario:', user);
      req.user = user;
      next();
    });
  }

// Middleware para verificar roles
function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado: Rol no autorizado' });
    }
    next();
  };
}

// Inicializa la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permitir solicitudes desde diferentes orígenes
app.use(express.json()); // Para analizar JSON en las solicitudes

// Exportar middlewares
module.exports = { authenticateToken, authorizeRole };

// Conexión a MongoDB
const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Modelos
const User = require('./models/User');

// Rutas
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const warehouseRoutes = require('./routes/warehouse.routes'); 
app.use('/api/warehouses', warehouseRoutes); 

// Endpoint para registrar usuarios
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  if (!firstName || !lastName || !username || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// Solo inicia el servidor si no se está ejecutando en un entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

// Exporta el servidor para pruebas
module.exports = app;