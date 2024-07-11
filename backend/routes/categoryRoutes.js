const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;