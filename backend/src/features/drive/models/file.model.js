const mongoose = require('mongoose');

const esquemaArchivo = new mongoose.Schema(
  {
    nombreOriginal: {
      type: String,
      required: [true, 'El nombre original del archivo es obligatorio'],
      trim: true
    },

    nombreVisible: {
      type: String,
      required: [true, 'El nombre visible del archivo es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar los 100 caracteres']
    },

    nombreGuardado: {
      type: String,
      required: [true, 'El nombre guardado del archivo es obligatorio']
    },

    rutaArchivo: {
      type: String,
      required: [true, 'La ruta del archivo es obligatoria']
    },

    tipoMime: {
      type: String,
      required: [true, 'El tipo MIME del archivo es obligatorio']
    },

    tamanioBytes: {
      type: Number,
      required: [true, 'El tamaño del archivo es obligatorio']
    }
  },
  {
    timestamps: true
  }
);

esquemaArchivo.set('toJSON', {
  versionKey: false,
  transform: function (documento, archivo) {
    archivo.id = archivo._id.toString();
    delete archivo._id;
    delete archivo.rutaArchivo;
    delete archivo.nombreGuardado;
    return archivo;
  }
});

const File = mongoose.model('File', esquemaArchivo);

module.exports = File;