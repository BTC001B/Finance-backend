const Contact = require('../models/Contact');
const ContactTransaction = require('../models/ContactTransaction');


// Create new contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      userId: req.body.userId // ✅ Ensure userId is saved
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay or Get Transaction
exports.addTransaction = async (req, res) => {
  try {
    const txn = await ContactTransaction.create({
      contactId: req.body.contactId,
      type: req.body.type,
      amount: req.body.amount,
      date: req.body.date,
      note: req.body.note,
      userId: req.body.userId // ✅ Ensure userId is saved
    });
    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all transactions for a contact
exports.getContactTransactions = async (req, res) => {
  try {
    const transactions = await ContactTransaction.findAll({
      where: { contactId: req.params.contactId }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contacts for a user
exports.getContactsByUserId = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.params.userId }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

