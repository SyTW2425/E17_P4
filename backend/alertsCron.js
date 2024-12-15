const cron = require('node-cron');
const Product = require('./models/Product');
const Warehouse = require('./models/Warehouse');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

const setupCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando verificación de alertas...');
    const today = new Date();

    try {
      // Obtener todos los productos
      const products = await Product.find();

      for (const product of products) {
        let alertMessage = '';

        // Verificar stock bajo
        if (product.stock <= product.minimunStock) {
          alertMessage += `El producto "${product.name}" tiene el stock bajo (${product.stock} unidades).<br>`;
        }

        // Verificar fecha de caducidad próxima
        if (product.spoil && (new Date(product.spoil) - today) / (1000 * 60 * 60 * 24) <= 10) {
          alertMessage += `El producto "${product.name}" está próximo a caducar (caduca el ${product.spoil.toLocaleDateString()}).<br>`;
        }

        if (alertMessage) {
          // Obtener el almacén asociado al producto
          const warehouse = await Warehouse.findById(product.warehouseId);

          if (warehouse) {
            // Obtener el dueño del almacén
            const owner = await User.findById(warehouse.userId);

            if (owner) {
              // Enviar correo al dueño del almacén
              await sendEmail({
                to: owner.email,
                subject: 'Alerta de inventario',
                html: `<p>${alertMessage}</p>`,
              });

              console.log(`Se envió una alerta al usuario ${owner.email} sobre el producto ${product.name}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar alertas:', error);
    }
  });
};

module.exports = setupCronJob;