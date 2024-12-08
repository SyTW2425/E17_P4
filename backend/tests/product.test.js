const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Warehouse = require('../models/Warehouse');
const Product = require('../models/Product');

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
  await Product.deleteMany({});
});

afterEach(async () => {
  await Warehouse.deleteMany({});
  await Product.deleteMany({});
});

describe('Product Endpoints', () => {
  let ownerToken, employeeToken, ownerId, employeeId, warehouseId;

  beforeEach(() => {
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

  it('debería crear un producto en un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse con producto',
      location: 'Ubicación prueba',
      userId: ownerId,
    });
    warehouseId = warehouse._id;

    const response = await request(app)
      .post(`/warehouses/${warehouseId}/products`)
      .set('Authorization', ownerToken)
      .send({
        name: 'Producto de prueba',
        description:'descripcion',
        stock:'2',
        category:'categoria',
        price: 100,
        supplier:'supplier',
        warehouseId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('product');
    expect(response.body.product).toHaveProperty('name', 'Producto de prueba');
  });

  it('debería listar productos de un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse con productos',
      location: 'Ubicación prueba',
      userId: ownerId,
    });
    warehouseId = warehouse._id;

    await Product.create({
      name: 'Producto 1',
      description:'descripcion',
      stock:'2',
      category:'categoria',
      price: 50,
      supplier:'supplier',
      warehouseId,
    });

    const response = await request(app)
      .get(`/warehouses/${warehouseId}/products`)
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('name', 'Producto 1');
  });

  it('debería actualizar un producto en un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse con producto a actualizar',
      location: 'Ubicación prueba',
      userId: ownerId,
    });
    warehouseId = warehouse._id;

    const product = await Product.create({
      name: 'Producto a actualizar',
      description:'descripcion',
      stock:'2',
      category:'categoria',
      price: 70,
      supplier:'supplier',
      warehouseId,
    });
    ///warehouses/:warehouseId/products/:productId
    const response = await request(app)
      .put(`/warehouses/${warehouseId}/products/${product._id}`)
      .set('Authorization', ownerToken)
      .send({
        name: 'Producto actualizado',
        price: 90,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('product');
    expect(response.body.product).toHaveProperty('name', 'Producto actualizado');
    expect(response.body.product).toHaveProperty('price', 90);
  });

  it('debería eliminar un producto de un almacén', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse con producto a eliminar',
      location: 'Ubicación prueba',
      userId: ownerId,
    });
    warehouseId = warehouse._id;

    const product = await Product.create({
        name: 'Producto a actualizar',
        description:'descripcion',
        stock:'2',
        category:'categoria',
        price: 70,
        supplier:'supplier',
        warehouseId,
    });
    const response = await request(app)
      .delete(`/warehouses/${warehouseId}/products/${product._id}`)
      .set('Authorization', ownerToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Producto eliminado exitosamente.');
  });

  it('debería evitar que un empleado edite un producto si no tiene permisos', async () => {
    const warehouse = await Warehouse.create({
      name: 'Warehouse restringido',
      location: 'Ubicación prueba',
      userId: ownerId,
      employees: [{ employeeId, permissions: ['ADD'] }],
    });
    warehouseId = warehouse._id;

    const product = await Product.create({
        name: 'Producto a actualizar',
        description:'descripcion',
        stock:'2',
        category:'categoria',
        price: 70,
        supplier:'supplier',
        warehouseId,
    });

    const response = await request(app)
      .put(`/warehouses/${warehouseId}/products/${product._id}`)
      .set('Authorization', employeeToken)
      .send({
        name: 'Intento de actualización',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'No tienes permiso para editar productos en este almacén.'
    );
  });
});
