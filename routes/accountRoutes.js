// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/accountController');

router.post('/create', ctrl.createAccount);
router.get('/balance/userId/:userId', ctrl.getBalance);
router.post('/deposit/userId/:userId', ctrl.deposit);
router.post('/withdraw/userId/:userId', ctrl.withdraw);

module.exports = router;
