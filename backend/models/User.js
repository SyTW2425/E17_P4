const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

// Función estática para buscar usuario por username
userSchema.statics.findByUsername = async function (username) {
  return await this.findOne({ username });
};

const User = mongoose.model('User', userSchema);
module.exports = User;

