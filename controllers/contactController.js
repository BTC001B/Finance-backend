const Contact = require('../models/Contact');
const ContactTransaction = require('../models/ContactTransaction');


// Create new contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      userId: req.body.userId 
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
      userId: req.body.userId                                                                                                                                                                                         
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

    let totalPay = 0;
    let totalGet = 0;

    transactions.forEach(x => {
      if (x.type === "pay") {
        totalPay += x.amount;
      }
      if (x.type === "get") {
        totalGet += x.amount;
      }
    });

    res.json({
      "Amount Paid": totalPay,
      "Amount Gain": totalGet,
      transactions
    });
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


exports.getContactByContactId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Contact.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "File Not Found" }); // return to stop further execution
    }

    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurring getting Contact" });
  }
};

exports.updateContactDetails = async (req, res) => {
  try {
    const item = await Contact.findByPk(req.body.id);

    if (!item) {
      return res.status(404).json({ error: "Contact Not Found" });
    }

    await item.update(req.body); // update already saves changes

    res.json({ message: "Updated Successfully", data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred while updating Contact" });
  }
};


exports.deleteContact = async (req,res)=>{
  try{
    const {id} = req.params;
    const item = await Contact.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: "Contact Not Found" });
    }
    await item.destroy();
    res.json({ message: "Deleted Successfully", data: item });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred while Deleting Contact" });
  }
}
