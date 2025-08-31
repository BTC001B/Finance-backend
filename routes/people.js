const express = require('express');
const router = express.Router();
const peopleController = require('../controllers/peopleController');

router.post('/create', peopleController.createPerson);
router.post('/addTransaction', peopleController.addTransaction);
router.get('/expenses', peopleController.getAllPeopleExpenses);
router.get('/user/:userId', peopleController.getPeopleByUserId); // ✅ New route

module.exports = router;
