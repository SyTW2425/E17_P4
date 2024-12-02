const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
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
  await Product.deleteMany({});
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Product Endpoints', () => {
  let token;

  beforeEach(() => {
    // Crear un usuario de prueba y generar un token
    const testUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'testuser@example.com',
      role: 'admin',
      firstName: 'Test',
      lastName: 'User',
    };
    token = generateTestToken(testUser);
  });

  it('debería crear un producto con éxito', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Producto de prueba',
        description: 'Descripción del producto',
        stock: 10,
        category: 'Categoría de prueba',
        price: 100,
        supplier: 'Proveedor de prueba',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('product');
    expect(response.body.product).toHaveProperty('name', 'Producto de prueba');
  });

  it('debería devolver todos los productos', async () => {
    await Product.create({
      name: 'Producto existente',
      description: 'Descripción existente',
      stock: 5,
      category: 'Categoría existente',
      price: 50,
      supplier: 'Proveedor existente',
    });

    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('debería actualizar un producto por ID', async () => {
    const product = await Product.create({
      name: 'Producto a actualizar',
      description: 'Descripción a actualizar',
      stock: 15,
      category: 'Categoría',
      price: 200,
      supplier: 'Proveedor',
    });

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Producto actualizado',
      });

    expect(response.status).toBe(200);
    expect(response.body.product).toHaveProperty('name', 'Producto actualizado');
  });

  it('debería eliminar un producto por ID', async () => {
    const product = await Product.create({
      name: 'Producto a eliminar',
      description: 'Descripción a eliminar',
      stock: 20,
      category: 'Categoría',
      price: 300,
      supplier: 'Proveedor',
    });

    const response = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Producto eliminado');
  });
});