const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Falta MONGODB_URI en el archivo .env');
  }

  await mongoose.connect(mongoUri);

  console.log('Conectado a MongoDB');
}

module.exports = connectDB;