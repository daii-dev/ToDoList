const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.get('/tasks', taskController.listarTareas);
router.get('/tasks/:id', taskController.obtenerTarea);
router.post('/tasks', taskController.crearTarea);
router.patch('/tasks/:id', taskController.actualizarTarea);
router.delete('/tasks/:id', taskController.eliminarTarea);

module.exports = router;