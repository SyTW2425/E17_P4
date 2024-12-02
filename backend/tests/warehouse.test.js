const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Asegúrate de que exportas correctamente `app` en server.js
const Warehouse = require('../models/Warehouse');

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
  await Warehouse.deleteMany({});
  console.log('Base de datos de almacenes limpiada.');

  await Warehouse.insertMany([
    {
      id: 1,
      name: 'Almacén A',
      location: {
        address: 'Dirección A',
        city: 'Ciudad A',
        country: 'País A',
      },
      capacity: 500,
      currentStock: 200,
      manager: 'Gerente A',
      contactNumber: '123456789',
    },
    {
      id: 2,
      name: 'Almacén B',
      location: {
        address: 'Dirección B',
        city: 'Ciudad B',
        country: 'País B',
      },
      capacity: 300,
      currentStock: 150,
      manager: 'Gerente B',
      contactNumber: '987654321',
    },
  ]);

  console.log('Almacenes insertados en la base de datos.');
});

afterEach(async () => {
  await Warehouse.deleteMany({});
  console.log('Base de datos de almacenes limpiada.');
});

describe('Warehouse API', () => {
  describe('GET /api/warehouses', () => {
    it('debería listar todos los almacenes', async () => {
      const response = await request(app)
        .get('/api/warehouses')
        .set('Authorization', `Bearer ${token}`);

      console.log('Respuesta del endpoint:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, name: 'Almacén A' }),
          expect.objectContaining({ id: 2, name: 'Almacén B' }),
        ])
      );
    });
  });

  describe('GET /api/warehouses/:id', () => {
    it('debería devolver un almacén por ID válido', async () => {
      const response = await request(app)
        .get('/api/warehouses/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: 1, name: 'Almacén A' });
    });

    it('debería devolver un error 404 para un ID no encontrado', async () => {
      const response = await request(app)
        .get('/api/warehouses/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Almacén no encontrado.');
    });
  });

  describe('POST /api/warehouses', () => {
    it('debería crear un almacén con datos válidos', async () => {
      const warehouseData = {
        id: 3,
        name: 'Almacén C',
        location: {
          address: 'Dirección C',
          city: 'Ciudad C',
          country: 'País C',
        },
        capacity: 400,
        currentStock: 100,
        manager: 'Gerente C',
        contactNumber: '1122334455',
      };

      const response = await request(app)
        .post('/api/warehouses')
        .set('Authorization', `Bearer ${token}`)
        .send(warehouseData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Almacén creado con éxito.');
      expect(response.body.warehouse).toMatchObject(warehouseData);

      const createdWarehouse = await Warehouse.findOne({ id: 3 });
      expect(createdWarehouse).not.toBeNull();
      expect(createdWarehouse).toMatchObject(warehouseData);
    });

    it('debería fallar si falta algún campo obligatorio', async () => {
      const incompleteData = {
        id: 4,
        name: 'Almacén D',
        // Falta location, capacity, currentStock, manager, contactNumber
      };

      const response = await request(app)
        .post('/api/warehouses')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Todos los campos son obligatorios.');
    });
  });

  describe('DELETE /api/warehouses/:id', () => {
    it('debería eliminar un almacén por ID válido', async () => {
      const response = await request(app)
        .delete('/api/warehouses/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Almacén eliminado con éxito.');

      const deletedWarehouse = await Warehouse.findOne({ id: 1 });
      expect(deletedWarehouse).toBeNull();
    });

    it('debería devolver un error 404 para un ID no encontrado', async () => {
      const response = await request(app)
        .delete('/api/warehouses/999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Almacén no encontrado.');
    });
  });
});
