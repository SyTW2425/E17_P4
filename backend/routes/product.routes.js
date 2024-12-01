const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, authorizeRole } = require('../server');

const router = express.Router();

// Crear un producto (Solo para usuarios con rol "Dueño")
router.post('/api/products', authenticateToken, authorizeRole('Dueño'), async (req, res) => {
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

router.get('/warehouses/:id/products', authenticateToken, async (req, res) => {
    const warehouseId = parseInt(req.params.id, 10); // Convertir a número
    console.log('warehouseId recibido en el endpoint:', warehouseId); // Log para verificar el valor
  
    try {
      const products = await Product.find({ warehouseId });
      console.log('Productos encontrados en la consulta:', products); // Log para verificar los resultados
  
      if (!products || products.length === 0) {
        console.log('No se encontraron productos para este almacén.');
        return res.status(404).json({ message: 'No se encontraron productos para este almacén.' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener los productos.', error });
    }
  });
  

module.exports = router;
