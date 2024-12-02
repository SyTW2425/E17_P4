const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Asegúrate de que exportas correctamente `app` en server.js
const Product = require('../models/Product');

// Crear un token de prueba
const token = jwt.sign({ id: 'test-user-id', role: 'Dueño' }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Product.deleteMany({});
  console.log('Base de datos limpiada.');

  await Product.insertMany([
    {
      id: 1,
      name: 'Producto A',
      description: 'Prueba A',
      stock: 50,
      category: 'Cat A',
      price: 20,
      supplier: 'Sup A',
      warehouseId: 1,
    },
    {
      id: 2,
      name: 'Producto B',
      description: 'Prueba B',
      stock: 30,
      category: 'Cat B',
      price: 10,
      supplier: 'Sup B',
      warehouseId: 1,
    },
  ]);

  const products = await Product.find({});
  console.log('Productos insertados:', products);
});

afterEach(async () => {
    // Limpiar la colección después de cada prueba
    await Product.deleteMany({});
    console.log('Base de datos limpiada.');
  });

describe('Productos API', () => {
  describe('GET /api/warehouses/:id/products', () => {
    it('debería listar los productos del almacén especificado', async () => {
      const response = await request(app)
        .get('/api/warehouses/1/products') // Filtrar por warehouseId
        .set('Authorization', `Bearer ${token}`);

      console.log('Respuesta del endpoint:', response.body); // Log para depuración

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, name: 'Producto A', warehouseId: 1 }),
          expect.objectContaining({ id: 2, name: 'Producto B', warehouseId: 1 }),
        ])
      );
    });

    it('debería devolver un error 404 si no hay productos en el almacén', async () => {
      const response = await request(app)
        .get('/api/warehouses/999/products') // ID inexistente
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No se encontraron productos para este almacén.');
    });
  });

  describe('POST /api/products', () => {
    it('debería crear un producto correctamente con datos válidos', async () => {
      const productData = {
        id: 3,
        name: 'Producto C',
        description: 'Prueba C',
        stock: 100,
        category: 'Cat C',
        price: 30.5,
        supplier: 'Sup C',
        warehouseId: 2, // Simplemente un identificador
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Producto creado con éxito.');
      expect(response.body.product).toMatchObject(productData);

      const createdProduct = await Product.findOne({ id: 3 });
      expect(createdProduct).not.toBeNull();
      expect(createdProduct).toMatchObject(productData);
    });

    it('debería fallar si falta algún campo obligatorio', async () => {
      const incompleteData = {
        id: 4,
        name: 'Producto D',
        description: 'Prueba D',
        // Falta stock, category, price, supplier, warehouseId
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Todos los campos son obligatorios.');
    });

    it('debería fallar si el usuario no tiene el rol adecuado', async () => {
      const invalidToken = jwt.sign({ id: 'test-user-id', role: 'Empleado' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      const productData = {
        id: 5,
        name: 'Producto E',
        description: 'Prueba E',
        stock: 10,
        category: 'Cat E',
        price: 15.5,
        supplier: 'Sup E',
        warehouseId: 3,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(productData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Acceso denegado: Rol no autorizado');
    });
  });
});
