const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,  // Requerido
  },
  lastName: {
    type: String,
    required: true,  // Requerido
  },
  username: {
    type: String,
    required: true,  // Requerido
    unique: true,  // Asegurarse de que el nombre de usuario sea único
  },
  email: {
    type: String,
    required: true,  // Requerido
    unique: true,  // Asegurarse de que el email sea único
  },
  password: {
    type: String,
    required: true,  // Requerido
  },
  role: {
    type: String,
    required: true,  // Requerido
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
