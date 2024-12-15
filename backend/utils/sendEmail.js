const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'myinventoryhubteam@gmail.com', 
        pass: 'grupoe17',       
      },
    });

    await transporter.sendMail({
      from: 'myinventoryhubteam@gmail.comm',  
      to,
      subject,
      text,
    });

    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = sendEmail;