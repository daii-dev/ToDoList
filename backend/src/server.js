require('dotenv').config();

const https = require('https');
const app = require('./app');
const connectDB = require('./config/db');
const obtenerOpcionesHttps = require('./config/httpsOptions');

const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

async function startServer() {
  await connectDB();
  const opcionesHttps = obtenerOpcionesHttps();
  https.createServer(opcionesHttps, app).listen(HTTPS_PORT, function () {
    console.log(`Servidor ejecutándose en http://localhost:${HTTPS_PORT}`);
  });
}

startServer().catch(function (error) {
  console.error('No se pudo iniciar el servidor HTTPS');
  console.error(error);
  process.exit(1);
});