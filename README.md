# MyInventoryHub

MyInventoryHub es una aplicación web destinada a la **gestión de inventarios** para pequeños negocios. Ofrece funcionalidades avanzadas como control de stock, alertas de caducidad, gestión de almacenes y proveedores, y mucho más.

## Características principales

- **Gestión de productos:** Creación, edición y eliminación de productos.
- **Control de stock:** Alertas de stock bajo y proximidad de caducidad.
- **Múltiples almacenes:** Posibilidad de manejar diferentes localizaciones de almacenamiento.
- **Sistema de roles:** Acceso restringido según el tipo de usuario (Dueño o Empleado).
- **Sistema de permisos:** Acceso restringido a ciertas acciones según los permisos de los Empleados.
- **Autenticación segura:** Manejo de usuarios con JWT.
- **Sistema de alertas por correo:** Notificaciones automáticas para dueños de almacenes.
- **Estadísticas de productos:** Acceso a estadísticas de los productos de cada almacén.

## Tecnologías utilizadas

- **Frontend:** Angular 18, PrimeNG, Bootstrap, TailWind.
- **Backend:** Node.js, Express, Mongoose.
- **Base de datos:** MongoDB.
- **Autenticación:** JSON Web Tokens (JWT).
- **Correo electrónico:** Nodemailer con OAuth2 (Gmail).
- **Gestor de tareas programadas:** Node-Cron.
- **Pruebas CI/CD:** GitHub Actions.

---

## Instalación

### Requisitos previos

- Node.js v16 o superior.
- MongoDB en ejecución (local o en un servidor).
- Cuenta de Gmail con OAuth2 configurado para Nodemailer.

### Configuración del proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone git@github.com:SyTW2425/E17_P4.git
   cd E17_P04
   ```

2. **Instalar dependencias:**
   ```bash
   # En la carpeta del backend
   cd backend
   sudo npm install

   # En la carpeta del frontend
   cd MyInventoryHub
   sudo npm install
   ```

3. **Configurar variables de entorno:**
   - Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/myInventoryHub
     PORT=3000
     JWT_SECRET=this_is_a_secret
     MONGO_URI_TEST=mongodb://localhost:27017/testing
     ```

4. **Iniciar la aplicación:**
   ```bash
   # Iniciar el backend
   cd backend
   sudo node server.js

   # Iniciar el frontend
   cd MyInventoryHub
   sudo ng serve
   ```

5. **Acceso a la aplicación:**
   - El frontend estará disponible en `http://localhost:4200`.
   - El backend en `http://localhost:3000`.
   - Para la base de datos levantar el puerto 27017

---

## Pruebas CI/CD

Este proyecto utiliza **GitHub Actions** para integrar y verificar cambios automáticamente.

### Estado de la CI Pipeline

![CI Pipeline](https://github.com/SyTW2425/E17_P4/actions/workflows/ci.yml/badge.svg)

--- 
### Autores
- **Joel Aday Dorta Hernández** 
- **Ancor González Carballo** 
- **Jonathan Martínez Pérez**

