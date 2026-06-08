# Sistema To Do List y Drive

Aplicación web desarrollada con **React**, **Express**, **MongoDB**, **Mongoose**, **Multer** y **HTTPS local**

El sistema tiene tres partes principales:

1. **Autenticacion en 2 pasos**: permite crear cuenta, iniciar sesion y validar un codigo temporal antes de acceder al sistema
2. **To Do List**: permite crear, listar, editar, completar y eliminar tareas
3. **Drive**: permite subir, listar, descargar, renombrar y eliminar archivos


## Requisitos previos

Antes de ejecutar el proyecto se debe tener instalado:

* Node.js
* npm
* MongoDB local
* Git Bash o una terminal compatible
* OpenSSL para generar certificados locales `.pem`

---

## 1. Instalar dependencias del backend

```bash
cd backend
npm install
```


## 2. Configurar variables de entorno del backend

En la carpeta `backend`, crear:

```txt
.env
```

y copiar este cotnenido:

```env
APP_VERSION=1.0.0
MONGODB_URI=mongodb://127.0.0.1:27017/todo_list_api

HTTPS_PORT=3443
SSL_KEY_PATH=certs/key.pem
SSL_CERT_PATH=certs/cert.pem

JWT_SECRET=clave
JWT_EXPIRES_IN=2h
MOSTRAR_CODIGO_2FA=true
```

## 3. Generar certificados HTTPS locales

El backend funciona unicamente con HTTPS y para eso se deben generar dos archivos locales:

```txt
backend/certs/key.pem
backend/certs/cert.pem
```

Desde la carpeta `backend`, ejecutar:

```bash
mkdir -p certs
```

Luego generar los certificados con OpenSSL:

```bash
MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:2048 -nodes -sha256 \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```


## 4. Iniciar MongoDB local

El proyecto usa MongoDB local con la siguiente URI:

```env
mongodb://127.0.0.1:27017/todo_list_api
```

Se debe verificar que MongoDB este ejecutándose antes de levantar el backend

---

## 5. Cargar datos de prueba en la base de datos

Hemos incluido datos iniciales para pruebas en la carpeta:

```txt
backend/seed/
```

Para cargar la base de datos por lotes ejecutar desde la carpeta `backend`, para cargar los datos para el todolist y drive:

```bash
npm run seed
```


## 6. Levantar el backend con HTTPS

Siguiendo en la carpeta `backend`, ejecutar:

```bash
npm run dev
```

El backend debe levantarse en:

```txt
https://localhost:3443
```

Ejemplo de salida esperada:

```txt
Conectado a MongoDB
Servidor HTTPS ejecutándose en https://localhost:3443
```

Al abrir `https://localhost:3443` en el navegador puede aparecer una advertencia de seguridad porque el certificado certificado HTTPS es local.
Se puede continuar desde la opción avanzada del navegador


## 7. Instalar dependencias del frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
cd frontend
npm install
```

---

## 8. Levantar el frontend

Desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

El frontend se ejecuta en:

```txt
http://localhost:5173
```

el frontend usa un proxy de Vite para redirigir las peticiones `/api` hacia el backend HTTPS:

```txt
https://localhost:3443
```

---

## 9. Probar localhost

Abrir en el navegador:

```txt
http://localhost:5173
```

Primero aparecera la pantalla de autenticación en la cual se debe:

1. Crear una cuenta
2. Iniciar sesion con correo y contraseña
3. Ingresar el codigo 2FA de 6 digitos

Una vez pasada la autentiaccion se accedera a la pantalla principal donde se puede elegir entre los dos servicios de To Do List o Drive

---

# Autenticacion en 2 pasos
El sistema usa autenticación con Passport Local, JWT y un segundo paso mediante codigo temporal

| Método | Ruta                        | Descripción                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/auth/register`        | Crea una cuenta de usuario   |
| POST   | `//api/auth/login`          | Valida correo y contraseña   |
| POST   | `/api/auth/verify-2fa`      | Valida codigo de segundo paso|
| GET    | `/api/auth/me`              | Devuelve usuario autenticado |

---

# Servicio To Do List

| Método | Ruta                        | Descripción                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/api/tasks?filter=all`     | Lista todas las tareas       |
| GET    | `/api/tasks?filter=pending` | Lista tareas pendientes      |
| GET    | `/api/tasks?filter=done`    | Lista tareas completadas     |
| GET    | `/api/tasks/:id`            | Obtiene una tarea            |
| POST   | `/api/tasks`                | Crea una tarea               |
| PUT    | `/api/tasks/:id`            | Actualiza título y fecha     |
| PATCH  | `/api/tasks/:id`            | Cambia el estado de la tarea |
| DELETE | `/api/tasks/:id`            | Elimina una tarea            |

---

# Servicio Drive

| Método | Ruta                      | Descripción                                    |
| ------ | ------------------------- | ---------------------------------------------- |
| GET    | `/api/files/init`         | Muestra información inicial del servicio Drive |
| GET    | `/api/files`              | Lista archivos                                 |
| GET    | `/api/files/:id`          | Obtiene información de un archivo              |
| POST   | `/api/files`              | Sube un archivo                                |
| PUT    | `/api/files/:id`          | Cambia el nombre visible del archivo           |
| GET    | `/api/files/:id/download` | Descarga un archivo                            |
| DELETE | `/api/files/:id`          | Elimina un archivo                             |