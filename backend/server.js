// Importación de las dependencias principales
const express = require('express'); // Framework para construir el servidor
const mongoose = require('mongoose'); // Base de datos
const cors = require('cors'); // Solicitudes desde frontend
const bcrypt = require('bcryptjs'); // Encriptar contraseñas
const jwt = require('jsonwebtoken'); // Manejar tokens JWT
require('dotenv').config(); // Se cargan variables de entorno desde .env
const setupCronJob = require('./alertsCron');

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

//setupCronJob();

//endpoints para gestion de usuarios//
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  // Verificar que estamos recibiendo los datos correctamente
  console.log('Datos recibidos:', req.body);

  if (!firstName || !lastName || !username || !email || !password || !role) {
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

    // Inicializar el cron job si es un dueño
    if (user.role === 'Dueño') {
      setupCronJob(user);
    }


  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

///

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

    const employee = await User.findOne({ username });

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
      return res.status(400).json({ message: 'Los permisos deben ser un array.' });
    }

    const warehouse = await Warehouse.findOne({ _id: warehouseId, userId: req.user.id });
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado o no tienes acceso.' });
    }

    // Encuentra al empleado dentro del array de empleados del almacén
    const employee = warehouse.employees.find(e => e.employeeId.toString() === employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado en este almacén.' });
    }

    // Actualiza los permisos del empleado
    employee.permissions = permissions;
    await warehouse.save();

    res.status(200).json({ message: 'Permisos actualizados exitosamente', warehouse });
  } catch (error) {
    console.error('Error al actualizar permisos del empleado:', error);
    res.status(500).json({ message: 'Error al actualizar permisos del empleado', error });
  }
});

///

//endpoints para productos//

//Obtener productos de un almacén
app.get('/warehouses/:warehouseId/products', authenticateToken, async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    // Verificar acceso del usuario al almacén
    if (req.user.role === 'Empleado') {
      const employee = warehouse.employees.find(e => e.employeeId.toString() === req.user.id);
      if (!employee) {
        return res.status(403).json({ message: 'No tienes acceso a este almacén.' });
      }
    } else if (req.user.role !== 'Dueño' || warehouse.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este almacén.' });
    }

    const products = await Product.find({ warehouseId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});


//crear producto para un almacen
app.post('/warehouses/:warehouseId/products', authenticateToken, async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { name, description, stock, minimunStock, category, price, unit, spoil, supplier } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    // Verificar permisos
    if (req.user.role === 'Empleado') {
      const employee = warehouse.employees.find(e => e.employeeId.toString() === req.user.id);
      if (!employee || !employee.permissions.includes('ADD')) {
        return res.status(403).json({ message: 'No tienes permiso para crear productos en este almacén.' });
      }
    } else if (req.user.role !== 'Dueño' || warehouse.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este almacén.' });
    }

    const newProduct = new Product({
      name,
      description,
      stock,
      minimunStock,
      category,
      price,
      unit,
      spoil,
      supplier,
      warehouseId,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto', error });
  }
});

//actualizar producto
app.put('/warehouses/:warehouseId/products/:productId', authenticateToken, async (req, res) => {
  try {
    const { warehouseId, productId } = req.params;
    const updates = req.body;

    // Verificar que el almacén existe
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    // Verificar permisos
    if (req.user.role === 'Empleado') {
      const employee = warehouse.employees.find(e => e.employeeId.toString() === req.user.id);
      if (!employee || !employee.permissions.includes('EDIT')) {
        return res.status(403).json({ message: 'No tienes permiso para editar productos en este almacén.' });
      }
    } else if (req.user.role !== 'Dueño' || warehouse.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este almacén.' });
    }

    // Actualizar el producto
    const product = await Product.findOneAndUpdate(
      { _id: productId, warehouseId },
      updates,
      { new: true } // Devuelve el documento actualizado
    );
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en este almacén.' });
    }

    res.status(200).json({ message: 'Producto actualizado exitosamente.', product });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto.', error });
  }
});

//eliminar producto
app.delete('/warehouses/:warehouseId/products/:productId', authenticateToken, async (req, res) => {
  try {
    const { warehouseId, productId } = req.params;

    // Verificar que el almacén existe
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    // Verificar permisos
    if (req.user.role === 'Empleado') {
      const employee = warehouse.employees.find(e => e.employeeId.toString() === req.user.id);
      if (!employee || !employee.permissions.includes('DELETE')) {
        return res.status(403).json({ message: 'No tienes permiso para eliminar productos en este almacén.' });
      }
    } else if (req.user.role !== 'Dueño' || warehouse.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este almacén.' });
    }

    // Eliminar el producto
    const product = await Product.findOneAndDelete({ _id: productId, warehouseId });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en este almacén.' });
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente.', product });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto.', error });
  }
});

//endpoint para alertas
app.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado (dueño)
    const today = new Date();

    // Buscar almacenes que pertenezcan al usuario
    const warehouses = await Warehouse.find({ userId }).select('_id');

    if (!warehouses.length) {
      return res.status(404).json({ message: 'No se encontraron almacenes asociados al usuario.' });
    }

    // Extraer los IDs de los almacenes
    const warehouseIds = warehouses.map(warehouse => warehouse._id);

    // Buscar productos en los almacenes del usuario
    const products = await Product.find({ warehouseId: { $in: warehouseIds } });

    // Filtrar productos con stock bajo o caducidad próxima
    const alerts = products.filter(product => {
      return (
        product.stock <= product.minimunStock || // Stock bajo
        (product.spoil && (new Date(product.spoil) - today) / (1000 * 60 * 60 * 24) <= 10) // Caducidad próxima
      );
    });

    // Transformar los datos para hacerlos más legibles
    const formattedAlerts = alerts.map(product => {
      const messages = [];

      if (product.stock <= product.minimunStock) {
        messages.push(`El stock de "${product.name}" es bajo (${product.stock} unidades).`);
      }

      if (product.spoil && (new Date(product.spoil) - today) / (1000 * 60 * 60 * 24) <= 10) {
        messages.push(`El producto "${product.name}" caduca pronto (${product.spoil.toLocaleDateString()}).`);
      }

      return { product: product.name, messages };
    });

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
  }
});

// Inicializar el cron job (solo para Dueños)
app.post('/start-cron', authenticateToken, (req, res) => {
  const user = req.user;

  if (user.role !== 'Dueño') {
    return res.status(403).json({ message: 'No tienes permiso para iniciar el cron job.' });
  }

  try {
    setupCronJob(user); // Pasamos el objeto `user` al cron job
    res.status(200).json({ message: 'Cron job inicializado exitosamente.' });
  } catch (error) {
    console.error('Error al iniciar el cron job:', error);
    res.status(500).json({ message: 'Error al iniciar el cron job.', error });
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