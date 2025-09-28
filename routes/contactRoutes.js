const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


router.get("/all/:userId",contactController.getAllTransactions);
router.delete("/delete/:id",contactController.deleteContact);
router.put("/update",contactController.updateContactDetails);
router.get("/id/:id",contactController.getContactByContactId);
router.post('/create', contactController.createContact);
router.post('/transaction', contactController.addTransaction);
router.get('/transactions/:contactId', contactController.getContactTransactions);
router.get('/contacts/user/:userId', contactController.getContactsByUserId); // ✅ new
router.put("/transaction/:id/update",contactController.updateTransactionDetails);

module.exports = router;
