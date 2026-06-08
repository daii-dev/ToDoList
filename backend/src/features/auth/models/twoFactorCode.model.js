const mongoose = require('mongoose');

const twoFactorCodeSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    codigoHash: {
      type: String,
      required: true,
      select: false
    },

    usado: {
      type: Boolean,
      default: false
    },

    expiraEn: {
      type: Date,
      required: true,
      index: {
        expires: 0
      }
    }
  },
  {
    timestamps: true
  }
);

twoFactorCodeSchema.set('toJSON', {
  versionKey: false,
  transform: function (documento, codigo) {
    codigo.id = codigo._id.toString();
    delete codigo._id;
    delete codigo.codigoHash;
    return codigo;
  }
});

const TwoFactorCode = mongoose.model('TwoFactorCode', twoFactorCodeSchema);

module.exports = TwoFactorCode;