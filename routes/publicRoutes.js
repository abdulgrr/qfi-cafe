const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Homepage
router.get('/', publicController.getHomePage);

// Public QR Menu
router.get('/menu', publicController.getMenuPage);

module.exports = router;
