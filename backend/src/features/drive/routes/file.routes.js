const express = require('express');
const fileController = require('../controllers/file.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/files/init', fileController.iniciarDrive);
router.get('/files', fileController.listarArchivos);
router.get('/files/:id', fileController.obtenerArchivo);
router.post('/files', upload.single('archivo'), fileController.subirArchivo);
router.put('/files/:id', fileController.actualizarNombreArchivo);
router.get('/files/:id/download', fileController.descargarArchivo);
router.delete('/files/:id', fileController.eliminarArchivo);

module.exports = router;