const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  minimunStock: { type: Number, required: false},
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  unit: {type: String, required: false},
  spoil: {type: Date, required: false},
  supplier: { type: String, required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }, 
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;