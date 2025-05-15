# 🔐 Encriptado de Contraseñas con Login Seguro

Este proyecto es una aplicación web de autenticación que permite el registro y acceso de usuarios utilizando encriptación de contraseñas con bcrypt. Está desarrollado con una arquitectura de cliente-servidor utilizando Node.js, Express, React, PostgreSQL y tecnologías web como HTML, CSS y JavaScript. La base de datos está alojada en AWS.

## 🚀 Tecnologías Utilizadas

- 🟢 **Node.js**
- ⚙️ **Express.js**
- 💻 **JavaScript**
- 🎨 **REACT HTML5 y CSS3**
- 🗃️ **PostgreSQL (en AWS)**
- 🔐 **bcryptjs** (para hashing de contraseñas)

---

## 🧩 Funcionalidades

- ✅ Registro de usuario con encriptación de contraseña
- ✅ Generación de hash con `bcrypt` para asegurar credenciales
- ✅ Almacenamiento de usuarios en base de datos PostgreSQL remota (AWS)
- ✅ Autenticación en el login usando datos registrados previamente
- ✅ Redirección a una página de bienvenida tras autenticación exitosa

---

## 📦 Ejecucion
Antes de iniciar, asegúrate de tener Node.js y npm instalados en tu sistema. Si no los tienes, puedes descargarlos desde:

🔗 https://nodejs.org/es

Una vez tengas Node.js, sigue estos pasos:

1. Abre el proyecto en tu editor favorito (como Visual Studio Code).

2. Instala las dependencias necesarias:

  -En la carpeta frontend, se utilizan bibliotecas como Axios (para peticiones HTTP) y React Router DOM (para navegación entre vistas).

  -En ambas carpetas (frontend y backend), ejecuta el comando npm install desde la terminal para instalar las dependencias correspondientes.

3. Ejecuta los servicios:

  -En una terminal, entra en la carpeta backend y ejecuta el servidor con npm start. Esto levantará el backend, que se conecta a la base de datos PostgreSQL en AWS y maneja el registro, autenticación y cifrado.

  -En una segunda terminal, entra en la carpeta frontend y ejecuta npm start. Esto lanzará la aplicación React que permite el acceso y registro de usuarios desde una interfaz web.

