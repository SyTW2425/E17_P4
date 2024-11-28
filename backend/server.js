// Importación de las dependencias principales
const express = require('express'); // Framework para construir el servidor
const mongoose = require('mongoose'); // Base de datos
const cors = require('cors'); // Solicitudes desde frontend
const bcrypt = require('bcryptjs'); // Encriptar contraseñas
const jwt = require('jsonwebtoken'); // Manejar tokens JWT
require('dotenv').config(); // Se cargan variables de entorno desde .env

// Inicializa la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permitir solicitudes desde diferentes orígenes
app.use(express.json()); // Para analizar JSON en las solicitudes

// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user; // Almacena los datos del token en req.user
    next();
  });
}
module.exports = { authenticateToken }; //por si se quiere llevar la logica a otro archivo

//middleware para veririficar roles
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado: Rol no autorizado' });
    }
    next();
  };
}

const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

// Conexión a MongoDB
mongoose.connect(/*process.env.MONGO_URI*/mongoURI, {
  /*useNewUrlParser: true,
  //useUnifiedTopology: true,*/ //deprecated?
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

//models
const User = require('./models/User');
//endpoints
app.post('/api/register', async (req, res) => {
  const { firstName,lastName,username, email, password, role } = req.body;

  // Verificar que estamos recibiendo los datos correctamente
  console.log('Datos recibidos:', req.body);

  if (!firstName || !lastName|| !username || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Generar un token JWT
    const token = jwt.sign({ id: User._id, email: User.email, role: User.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


    // Responder con éxito
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

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const user = await User.findOne({ email }); // Busca el usuario en la base de datos
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: User._id, email: User.email, role: User.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// Exportar app para pruebas
module.exports = app;
/*
// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
*/

// Solo inicia el servidor si no se está ejecutando en un entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}