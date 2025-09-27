const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


router.delete("/:id",contactController.deleteContact);
router.put("/update",contactController.updateContactDetails);
router.get("/id/:id",contactController.getContactByContactId);
router.post('/create', contactController.createContact);
router.post('/transaction', contactController.addTransaction);
router.get('/transactions/:contactId', contactController.getContactTransactions);
router.get('/contacts/user/:userId', contactController.getContactsByUserId); // ✅ new
// router.get('/transactions/user/:userId', contactController.getTransactionsByUserId); // ✅ new

module.exports = router;
