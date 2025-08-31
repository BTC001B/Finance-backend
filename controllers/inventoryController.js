const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create item (with userId)
exports.createItem = async (req, res) => {
  try {
    const { name, quantity, price, userId,sku,category,description,unitCost,reorderLevel } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const item = await Item.create({ name, quantity, price, userId ,sku,category,description,unitCost,reorderLevel});
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stock In
exports.stockIn = async (req, res) => {
  try {
    const { quantity, user, note } = req.body;
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity += quantity;
    await item.save();

    await Transaction.create({
      itemId: item.id,
      type: 'stock-in',
      quantity,
      user,
      note
    });

    res.json({ message: 'Stock added successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stock Out
exports.stockOut = async (req, res) => {
  try {
    const { quantity, user, note } = req.body;
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity -= quantity;
    await item.save();

    await Transaction.create({
      itemId: item.id,
      type: 'stock-out',
      quantity,
      user,
      note
    });

    res.json({ message: 'Stock reduced successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get inventory by userId
exports.getInventoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Item.findAll({ where: { userId } });

    if (!items.length) {
      return res.status(404).json({ message: 'No inventory found for this user' });
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
