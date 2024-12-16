const cron = require('node-cron');
const Product = require('./models/Product');
const Warehouse = require('./models/Warehouse');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

const setupCronJob = (user) => {
  // Validar si el rol del usuario es "Dueño"
  if (user.role !== 'Dueño') {
    console.error('El cron job solo está disponible para usuarios con el rol "Dueño".');
    return;
  }

  // Programar el cron job para ejecutarse diariamente a medianoche
  cron.schedule('* * * * *', async () => {
    console.log(`Ejecutando verificación de alertas para el usuario ${user.id}...`);
    const today = new Date();

    try {
      // Buscar almacenes del usuario dueño
      const warehouses = await Warehouse.find({ userId: user.id });

      if (!warehouses.length) {
        console.log(`No se encontraron almacenes para el usuario con ID: ${user.id}`);
        return;
      }

      for (const warehouse of warehouses) {
        // Buscar productos de este almacén
        const products = await Product.find({ warehouseId: warehouse._id });

        let alertMessage = '';

        for (const product of products) {
          // Verificar stock bajo
          if (product.minimunStock && product.stock <= product.minimunStock) {
            alertMessage += `El producto "${product.name}" tiene el stock bajo (${product.stock} unidades).<br>`;
          }

          // Verificar fecha de caducidad próxima
          if (product.spoil && (new Date(product.spoil) - today) / (1000 * 60 * 60 * 24) <= 10) {
            alertMessage += `El producto "${product.name}" está próximo a caducar (caduca el ${product.spoil.toLocaleDateString()}).<br>`;
          }
        }

        // Enviar correo si hay alertas
        if (alertMessage) {
          await sendEmail(
            user.email, // Dirección del correo
            'Alerta de inventario', // Asunto
            null, // Texto sin formato (puede ser null si solo usamos HTML)
            `<p>${alertMessage}</p>` // Contenido HTML del mensaje
          );

          console.log(
            `Se envió una alerta al usuario ${user.email} sobre los productos del almacén "${warehouse.name}".`
          );
        } else {
          console.log(
            `No hay alertas para el usuario ${user.email} del almacén "${warehouse.name}".`
          );
        }
      }
    } catch (error) {
      console.error('Error al verificar alertas:', error);
    }
  });
};

module.exports = setupCronJob;
