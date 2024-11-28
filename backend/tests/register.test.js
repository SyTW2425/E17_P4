const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); 
const User = require('../models/User'); 

// Configuración de la base de datos de pruebas
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
});

afterAll(async () => {
  // Cierra la conexión a la base de datos después de las pruebas
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Limpia la colección de usuarios antes de cada prueba
  await User.deleteMany({});
});

afterEach(async () => {
  //Limpia la colección también después de cada prueba
  await User.deleteMany({});
});

// Pruebas para el endpoint de registro
describe('POST /api/register', () => {
  it('debería registrar un usuario correctamente', async () => {
    const newUser = {
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'juanperez@gmail.com',
      password: 'password123',
      role: 'admin',
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Verifica que la respuesta sea exitosa
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(response.body.user).toHaveProperty('email', 'juanperez@gmail.com');

    // Verifica que el usuario esté en la base de datos
    const userInDB = await User.findOne({ email: 'juanperez@gmail.com' });
    expect(userInDB).not.toBeNull();
    expect(userInDB.username).toBe('juanp');
  });

  it('debería fallar si falta algún campo', async () => {
    const incompleteUser = {
      firstName: 'Juan',
      email: 'juanperez@gmail.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/register')
      .send(incompleteUser);

    // Verifica que la respuesta sea un error
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Todos los campos son obligatorios.');
  });

  it('debería fallar si el correo ya está registrado', async () => {
    // Crea un usuario previamente
    await User.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'juanperez@gmail.com',
      password: 'password123', // Contraseña ya encriptada
      role: 'admin',
    });

    const newUser = {
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'juanperez@gmail.com',
      password: 'password123',
      role: 'admin',
    };

    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Verifica que la respuesta sea un conflicto
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'El correo ya está registrado.');
  });
});
