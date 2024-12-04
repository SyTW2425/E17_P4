const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Warehouse = require('../models/Warehouse');
const User = require('../models/User');
// Generar un token de prueba
const generateTestToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Configuración de la base de datos de pruebas
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Warehouse.deleteMany({});
});

afterEach(async () => {
  await Warehouse.deleteMany({});
});

describe('Warehouse Endpoints', () => {
  let ownerToken, employeeToken, ownerId, employeeId, warehouseId;

  beforeEach(() => {
    // Crear usuarios de prueba y generar tokens
    const owner = {
      _id: new mongoose.Types.ObjectId(),
      email: 'owner@example.com',
      role: 'Dueño',
      firstName: 'Owner',
      lastName: 'Test',
    };
    const employee = {
      _id: new mongoose.Types.ObjectId(),
      email: 'employee@example.com',
      role: 'Empleado',
      firstName: 'Employee',
      lastName: 'Test',
    };

    ownerToken = `Bearer ${generateTestToken(owner)}`;
    employeeToken = `Bearer ${generateTestToken(employee)}`;
    ownerId = owner._id;
    employeeId = employee._id;
  });

  it('debería crear un almacén con éxito si el usuario es dueño', async () => {
    const response = await request(app)
      .post('/warehouses')
      .set('Authorization', ownerToken)
      .send({
        name: 'Warehouse de prueba',
        location: 'Ubicación de prueba',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('warehouse');
    expect(response.body.warehouse).toHaveProperty('name', 'Warehouse de prueba');
    warehouseId = response.body.warehouse._id;
  });

  it('debería devolver un error si el usuario no es dueño al crear un almacén', async () => {
    const response = await request(app)
      .post('/warehouses')
      .set('Authorization', employeeToken)
      .send({
        name: 'Warehouse no autorizado',
        location: 'Ubicación no autorizada',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('No tienes permiso para crear almacenes');
  });

  it('debería listar los almacenes del dueño', async () => {
    await Warehouse.create({
      name: 'Warehouse del dueño',
      location: 'Ubicación del dueño',
      userId: ownerId,
    });

    const response = await request(app)
      .get('/warehouses')
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /*it('debería asignar un empleado a un almacén', async () => {
      const warehouse = await Warehouse.create({
        name: 'Warehouse para asignar',
        location: 'Ubicación para asignar',
        userId: ownerId,
      });
  
      const response = await request(app)
        .post(`/warehouses/${warehouse._id}/employees`)
        .set('Authorization', ownerToken)
        .send({
          employeeId,
          permissions: ['ADD', 'EDIT'],
        });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Empleado asignado exitosamente');
    });
  */
  it('debería asignar un empleado a un almacén', async () => {
    // Crear el empleado en la base de datos usando el ID generado
    await User.create({
      _id: employeeId,
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'employee@example.com',
      password: 'password123', // Contraseña ya encriptada
      role: 'Empleado',
    });

    // Crear un almacén en la base de datos
    const warehouse = await Warehouse.create({
      name: 'Warehouse para asignar',
      location: 'Ubicación para asignar',
      userId: ownerId, // Este es el ID del dueño
    });

    // Realizar la solicitud al endpoint
    const response = await request(app)
      .post(`/warehouses/${warehouse._id}/employees`)
      .set('Authorization', ownerToken) // Asegurarse de que el token incluye los datos del dueño
      .send({
        employeeId: employeeId, // Usar el ID del empleado creado
        permissions: ['ADD', 'EDIT'],
      });

    // Verificaciones
    expect(response.status).toBe(200); // Debería ser exitoso
    expect(response.body.message).toBe('Empleado asignado exitosamente');
    expect(response.body.warehouse.employees.length).toBe(1); // Confirmar que se asignó
    expect(response.body.warehouse.employees[0]).toMatchObject({
      employeeId: employeeId.toString(),
      permissions: ['ADD', 'EDIT'],
    });
  });
  it('debería actualizar un almacén si el usuario es dueño', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse a actualizar',
      location: 'Ubicación a actualizar',
      userId: ownerId,
    });

    const response = await request(app)
      .put(`/warehouses/${warehouse._id}`)
      .set('Authorization', ownerToken)
      .send({
        name: 'Warehouse actualizado',
      });

    expect(response.status).toBe(200);
    expect(response.body.warehouse).toHaveProperty('name', 'Warehouse actualizado');
  });

  it('debería eliminar un almacén si el usuario es dueño', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse a eliminar',
      location: 'Ubicación a eliminar',
      userId: ownerId,
    });

    const response = await request(app)
      .delete(`/warehouses/${warehouse._id}`)
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Almacén eliminado exitosamente');
  });

  it('debería eliminar a un empleado de un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse para eliminar empleado',
      location: 'Ubicación para eliminar empleado',
      userId: ownerId,
      employees: [{ employeeId, permissions: ['ADD', 'EDIT'] }],
    });

    const response = await request(app)
      .delete(`/warehouses/${warehouse._id}/employees/${employeeId}`)
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Empleado eliminado exitosamente del almacén');
  });

  it('debería listar empleados asignados a un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse para listar empleados',
      location: 'Ubicación para listar empleados',
      userId: ownerId,
      employees: [{ employeeId, permissions: ['ADD', 'EDIT'] }],
    });

    const response = await request(app)
      .get(`/warehouses/${warehouse._id}/employees`)
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });
});
