require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, function () {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

startServer().catch(function (error) {
  console.error('No se pudo iniciar el servidor');
  console.error(error);
  process.exit(1);
});