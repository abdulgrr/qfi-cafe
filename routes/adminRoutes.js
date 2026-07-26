const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Auth Routes
router.get('/login', adminController.getLoginPage);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected Admin Routes
router.use(requireAuth);

router.get('/dashboard', adminController.getDashboard);

// Product Management
router.get('/products/add', adminController.getAddProductPage);
router.post('/products/add', upload.single('image'), adminController.createProduct);

router.get('/products/edit/:id', adminController.getEditProductPage);
router.post('/products/edit/:id', upload.single('image'), adminController.updateProduct);

router.post('/products/delete/:id', adminController.deleteProduct);
router.post('/products/toggle/:id', adminController.toggleAvailability);

// Category Management
router.post('/categories/add', adminController.createCategory);

module.exports = router;
