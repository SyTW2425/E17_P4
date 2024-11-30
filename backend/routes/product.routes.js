const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, authorizeRole } = require('../server');
const router = express.Router();

// Crear un producto
router.post('/products', authenticateToken, authorizeRole('Dueño'), async (req, res) => {
  const { id, name, description, stock, category, price, supplier, warehouseId } = req.body;

  if (!id || !name || !description || stock === undefined || !category || price === undefined || !supplier || !warehouseId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const newProduct = new Product({
      id,
      name,
      description,
      stock,
      category,
      price,
      supplier,
      warehouseId,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado con éxito.', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto.', error });
  }
});

// Listar productos por almacén
router.get('/warehouses/:id/products', authenticateToken, async (req, res) => {
  const warehouseId = parseInt(req.params.id, 10);

  try {
    const products = await Product.find({ warehouseId });
    if (!products.length) {
      return res.status(404).json({ message: 'No se encontraron productos para este almacén.' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos.', error });
  }
});

module.exports = router;
