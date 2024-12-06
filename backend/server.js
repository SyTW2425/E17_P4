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

//models
const User = require('./models/User');
const Product = require('./models/Product');
const Warehouse = require('./models/Warehouse');

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(403).json({ message: 'Token no válido' });
    }
    req.user = user;
    next();
  });
};
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
//middleware que verifica si el usuario tiene acceso y permisos.
async function authorizeWarehouse(req, res, next) {
  const { warehouseId } = req.body;
  const userId = req.user.id;

  try {
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }

    // Verifica si el usuario es dueño del almacén
    if (warehouse.userId.toString() === userId) {
      req.isOwner = true;
      return next();
    }

    // Verifica si el usuario es un empleado con permisos
    const employee = warehouse.employees.find(e => e.employeeId.toString() === userId);
    if (!employee) {
      return res.status(403).json({ message: 'No tienes acceso a este almacén' });
    }

    req.permissions = employee.permissions;
    return next();
  } catch (error) {
    console.error('Error en la autorización del almacén:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// para el uso de las pruebas
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
    const token = jwt.sign(
      {
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role,
        firstName: newUser.firstName,  
        lastName: newUser.lastName     
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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

    const token = jwt.sign(
      {
        id: user._id, 
        email: user.email,
        role: user.role,
        firstName: user.firstName,  
        lastName: user.lastName     
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});


//endpoints wearehouses//

//crear almacen (solo dueños)
app.post('/warehouses', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Dueño') {
      return res.status(403).json({ message: 'No tienes permiso para crear almacenes' });
    }

    const { name, location } = req.body;
    const warehouse = new Warehouse({
      name,
      location,
      userId: req.user.id,
    });

    await warehouse.save();
    res.status(201).json({ message: 'Almacén creado exitosamente', warehouse });
  } catch (error) {
    console.error('Error al crear el almacén:', error);
    res.status(500).json({ message: 'Error al crear el almacén', error });
  }
});


//asignar empleados al almacen(solo dueños)
app.post('/warehouses/:id/employees', authenticateToken, async (req, res) => {
  try {
    const { id: warehouseId } = req.params;
    const { username, permissions } = req.body;

    const warehouse = await Warehouse.findOne({ _id: warehouseId, userId: req.user.id });
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso' });
    }
    
    const employee = await User.findOne({username});

    if (!employee || employee.role !== 'Empleado') {
      
      return res.status(400).json({ message: 'El usuario no es un empleado válido' });
    }
    //comprobar si el usuario ya existe, modificarlo
    warehouse.employees.push({ employeeId: employee._id, permissions });
    await warehouse.save();

    res.status(200).json({ message: 'Empleado asignado exitosamente', warehouse });
  } catch (error) {
    console.error('Error al asignar empleado:', error);
    res.status(500).json({ message: 'Error al asignar empleado', error });
  }
});

//editar almacen (solo dueños)
app.put('/warehouses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, location },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso' });
    }

    res.status(200).json({ message: 'Almacén actualizado exitosamente', warehouse });
  } catch (error) {
    console.error('Error al actualizar el almacén:', error);
    res.status(500).json({ message: 'Error al actualizar el almacén', error });
  }
});

//eliminar un almacen
app.delete('/warehouses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso' });
    }

    res.status(200).json({ message: 'Almacén eliminado exitosamente', warehouse });
  } catch (error) {
    console.error('Error al eliminar el almacén:', error);
    res.status(500).json({ message: 'Error al eliminar el almacén', error });
  }
});

//eliminar empleado
app.delete('/warehouses/:id/employees/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { id: warehouseId, employeeId } = req.params;

    const warehouse = await Warehouse.findOne({ _id: warehouseId, userId: req.user.id });
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso' });
    }

    warehouse.employees = warehouse.employees.filter(e => e.employeeId.toString() !== employeeId);
    await warehouse.save();

    res.status(200).json({ message: 'Empleado eliminado exitosamente del almacén', warehouse });
  } catch (error) {
    console.error('Error al eliminar empleado del almacén:', error);
    res.status(500).json({ message: 'Error al eliminar empleado del almacén', error });
  }
});

//ver empleados asignados a un almacen
app.get('/warehouses/:id/employees', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOne({ _id: id, userId: req.user.id }).populate('employees.employeeId', 'firstName lastName email');
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso' });
    }

    res.status(200).json(warehouse.employees);
  } catch (error) {
    console.error('Error al obtener empleados del almacén:', error);
    res.status(500).json({ message: 'Error al obtener empleados del almacén', error });
  }
});

//obtener almacenes de un usuario
app.get('/warehouses', authenticateToken, async (req, res) => {
  try {
    let warehouses;

    if (req.user.role === 'Dueño') {
      // Dueño: obtiene todos sus almacenes
      warehouses = await Warehouse.find({ userId: req.user.id }).populate('employees.employeeId', 'firstName lastName email');
    } else if (req.user.role === 'Empleado') {
      // Empleado: obtiene almacenes a los que tiene acceso
      warehouses = await Warehouse.find({ 'employees.employeeId': req.user.id });
    } else {
      return res.status(403).json({ message: 'No tienes permisos para ver almacenes' });
    }

    res.status(200).json(warehouses);
  } catch (error) {
    console.error('Error al obtener los almacenes:', error);
    res.status(500).json({ message: 'Error al obtener los almacenes', error });
  }
});


//editar permisos de los empleados (solo dueños)
app.put('/warehouses/:id/employees/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { id: warehouseId, employeeId } = req.params;
    const { permissions } = req.body;

    
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Los permisos deben ser un array válido.' });
    }

    
    const warehouse = await Warehouse.findOne({ _id: warehouseId, userId: req.user.id }); 
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso.' });
    }

    
    const employee = warehouse.employees.find(emp => emp.id === employeeId); //esto tiene algo raro
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado en este almacén.' });
    }

    
    employee.permissions = permissions;

   
    await warehouse.save();

    res.status(200).json({ message: 'Permisos actualizados exitosamente.', employee });
  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    res.status(500).json({ message: 'Error al actualizar permisos.', error });
  }
});

// Exportar app para pruebas
module.exports = app;


// Solo inicia el servidor si no se está ejecutando en un entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}