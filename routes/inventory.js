const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// 📦 Get all items
router.get('/', inventoryController.getAllItems);

// 📦 Get single item by ID
router.get('/:id', inventoryController.getItemById);

// ➕ Create new item
router.post('/', inventoryController.createItem);

// ✏️ Update item by ID
router.put('/:id', inventoryController.updateItem);

// ❌ Delete item by ID
router.delete('/:id', inventoryController.deleteItem);

// 📥 Stock In for an item
router.post('/stock-in/:id', inventoryController.stockIn);

// 📤 Stock Out for an item
router.post('/stock-out/:id', inventoryController.stockOut);

router.get('/inventory/:userId', inventoryController.getInventoryByUserId);

module.exports = router;
