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

        let alertMessages = [];

        for (const product of products) {
          // Verificar stock bajo
          if (product.minimunStock && product.stock <= product.minimunStock) {
            alertMessages.push(
              `Tu producto <strong>${product.name}</strong> tiene el stock bajo (${product.stock} unidades) en el almacén <strong>${warehouse.name}</strong>.`
            );
          }

          // Verificar fecha de caducidad próxima
          if (product.spoil && (new Date(product.spoil) - today) / (1000 * 60 * 60 * 24) <= 10) {
            alertMessages.push(
              `Tu producto <strong>${product.name}</strong> está próximo a caducar (caduca el ${new Date(product.spoil).toLocaleDateString()}) en el almacén <strong>${warehouse.name}</strong>.`
            );
          }
        }

        // Enviar correo si hay alertas
        if (alertMessages.length > 0) {
          const emailBody = `
            <p>Hola ${user.firstName},</p>
            <p>${alertMessages.join('<br>')}</p>
            <p>¡Date prisa!</p>
            <p>Equipo de My InventoryHub.</p>
          `;

          await sendEmail(
            user.email, // Dirección del correo
            'Alerta de inventario', // Asunto
            null, // Texto sin formato (puede ser null si solo usamos HTML)
            emailBody // Contenido HTML del mensaje
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
