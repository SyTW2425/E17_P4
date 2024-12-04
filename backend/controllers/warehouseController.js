const Warehouse = require('../models/Warehouse');

async function getUserWarehouses(req, res) {
  try {
    const userId = req.user.id; // Usuario autenticado
    const warehouses = await Warehouse.find({ owner: userId }); // Filtrar por propietario
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los almacenes' });
  }
}

module.exports = { getUserWarehouses };
