const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  location: { 
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  capacity: { type: Number, required: true, min: 0 }, // Capacidad máxima
  currentStock: { type: Number, required: true, min: 0 }, // Stock actual
  manager: { type: String, required: true }, // Nombre del responsable del almacén
  contactNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true } // Si el almacén está operativo
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;
