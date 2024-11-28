const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Asegúrate de que `app` está exportado correctamente
const User = require('../models/User'); // Importa el modelo de usuario

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
  // Opcional: Limpia la colección también después de cada prueba
  await User.deleteMany({});
});

// Pruebas para el endpoint de login
describe('POST /login', () => {
  it('debería iniciar sesión correctamente con credenciales válidas', async () => {
    // Prepara un usuario en la base de datos
    const password = 'password123';
    const hashedPassword = await require('bcryptjs').hash(password, 10);

    const user = await User.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'juanperez@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: password,
      });

    // Verifica que la respuesta sea exitosa
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('debería fallar si el usuario no existe', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'noexiste@gmail.com',
        password: 'password123',
      });

    // Verifica que la respuesta sea un error 404
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
  });

  it('debería fallar si la contraseña es incorrecta', async () => {
    // Prepara un usuario en la base de datos
    const password = 'password123';
    const hashedPassword = await require('bcryptjs').hash(password, 10);

    await User.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      username: 'juanp',
      email: 'juanperez@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'juanperez@gmail.com',
        password: 'contraseñaincorrecta',
      });

    // Verifica que la respuesta sea un error 401
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Contraseña incorrecta');
  });

  it('debería fallar si falta algún campo', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'juanperez@gmail.com', // Falta el campo "password"
      });

    // Verifica que la respuesta sea un error 400
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', expect.any(String));
  });
});
