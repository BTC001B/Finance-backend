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
    const { contactId, type, amount, date, note } = req.body;

    // Ensure the contact exists
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Create the transaction
    const txn = await ContactTransaction.create({
      contactId,
      type,
      amount,
      date,
      note
      // no need for userId, it's inherited via Contact
    });

    res.status(201).json(txn);
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

exports.getAllTransactions = async (req, res) => {
  try {
    const id = req.params.userId;

    // Fetch all transactions for contacts that belong to this user
    const transactions = await ContactTransaction.findAll({
      include: {
        model: Contact,
        where: { userId: userId }, // filter by Contact.userId
        attributes: ['id', 'name'] // optional: include contact info
      }
    });

    let totalPay = 0;
    let totalGet = 0;

    transactions.forEach(txn => {
      if (txn.type === "pay") totalPay += txn.amount;
      if (txn.type === "get") totalGet += txn.amount;
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


exports.updateTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContactTransaction.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    await item.update(req.body);
    return res.json({ data: item });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed To Update" });
  }
};

