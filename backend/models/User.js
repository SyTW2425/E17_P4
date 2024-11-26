const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Elimina espacios en los extremos
    lowercase: true, // Convierte el email a minúsculas
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Longitud mínima de 6 caracteres
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('User', userSchema);