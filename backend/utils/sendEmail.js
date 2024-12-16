const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // El servidor SMTP de Gmail
      port: 587,             // Puerto para conexiones TLS
      secure: false,         // False para conexiones STARTTLS
      auth: {
        user: 'myinventoryhubteam@gmail.com',
        pass: 'hmnt xscx hhxr gexz',
      },
    });

    await transporter.sendMail({
      from: 'myinventoryhubteam@gmail.com', 
      to,
      subject,
      text,
      html, 
    });

    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = sendEmail;
