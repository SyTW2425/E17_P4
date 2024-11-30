const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  supplier: { type: String, required: true },
  warehouseId: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
