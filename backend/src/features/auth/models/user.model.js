const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [30, 'El nombre no puede superar los 30 caracteres']
    },

    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.set('toJSON', {
  versionKey: false,
  transform: function (documento, usuario) {
    usuario.id = usuario._id.toString();
    delete usuario._id;
    delete usuario.passwordHash;
    return usuario;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;