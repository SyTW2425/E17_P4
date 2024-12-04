const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Dueño del almacén
  employees: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      permissions: { type: [String], enum: ['ADD', 'EDIT', 'DELETE'], default: [] }, // Permisos específicos
    },
  ],
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;
