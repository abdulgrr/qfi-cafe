const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Navigation Routes
router.get('/', publicController.getHomePage);
router.get('/menu', publicController.getMenuPage);
router.get('/about', publicController.getAboutPage);
router.get('/contact', publicController.getContactPage);

module.exports = router;
