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

// Category Management (CRUD)
router.post('/categories/add', adminController.createCategory);
router.post('/categories/edit/:id', adminController.updateCategory);
router.post('/categories/delete/:id', adminController.deleteCategory);

module.exports = router;
