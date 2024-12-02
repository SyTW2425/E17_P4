const express = require('express');
const Warehouse = require('../models/Warehouse');
const { authenticateToken, authorizeRole } = require('../server');

const router = express.Router();

// Crear un almacén (Solo para usuarios con rol "Dueño")
router.post('/', authenticateToken, authorizeRole('Dueño'), async (req, res) => {
  const { id, name, location, capacity, currentStock, manager, contactNumber } = req.body;

  if (!id || !name || !location || capacity === undefined || currentStock === undefined || !manager || !contactNumber) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const newWarehouse = new Warehouse({
      id,
      name,
      location,
      capacity,
      currentStock,
      manager,
      contactNumber,
    });

    await newWarehouse.save();
    res.status(201).json({ message: 'Almacén creado con éxito.', warehouse: newWarehouse });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el almacén.', error });
  }
});

// Obtener todos los almacenes (Disponible para cualquier usuario autenticado)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los almacenes.', error });
  }
});

// Obtener un almacén por ID (Disponible para cualquier usuario autenticado)
router.get('/:id', authenticateToken, async (req, res) => {
  const warehouseId = parseInt(req.params.id, 10);

  try {
    const warehouse = await Warehouse.findOne({ id: warehouseId });

    if (!warehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el almacén.', error });
  }
});

// Actualizar un almacén (Solo para usuarios con rol "Dueño")
router.put('/:id', authenticateToken, authorizeRole('Dueño'), async (req, res) => {
  const warehouseId = parseInt(req.params.id, 10);
  const updates = req.body;

  try {
    const updatedWarehouse = await Warehouse.findOneAndUpdate(
      { id: warehouseId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedWarehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    res.status(200).json({ message: 'Almacén actualizado con éxito.', warehouse: updatedWarehouse });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el almacén.', error });
  }
});

// Eliminar un almacén (Solo para usuarios con rol "Dueño")
router.delete('/:id', authenticateToken, authorizeRole('Dueño'), async (req, res) => {
  const warehouseId = parseInt(req.params.id, 10);

  try {
    const deletedWarehouse = await Warehouse.findOneAndDelete({ id: warehouseId });

    if (!deletedWarehouse) {
      return res.status(404).json({ message: 'Almacén no encontrado.' });
    }

    res.status(200).json({ message: 'Almacén eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el almacén.', error });
  }
});

module.exports = router;
