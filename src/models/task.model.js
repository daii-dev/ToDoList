const mongoose = require('mongoose');

const esquemaTarea = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la tarea es obligatorio'],
      trim: true,
      maxlength: [20, 'El título no puede superar los 20 caracteres']
    },

    date: {
      type: String,
      default: '',
      validate: {
        validator: function (valor) {
          return !valor || /^\d{4}-\d{2}-\d{2}$/.test(valor);
        },
        message: 'La fecha debe tener el formato de año-mes-día (YYYY-MM-DD)'
      }
    },

    done: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

esquemaTarea.set('toJSON', {
  versionKey: false,
  transform: function (documento, tarea) {
    tarea.id = tarea._id.toString();
    delete tarea._id;
    return tarea;
  }
});

const Task = mongoose.model('Task', esquemaTarea);

module.exports = Task;