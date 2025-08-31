const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.post('/create', goalController.createGoal);
router.post('/addAmount', goalController.addAmount);
router.get('/history/:goalId', goalController.getGoalHistory);
router.get('/user/:userId', goalController.getGoalsByUserId); // ✅ New route

module.exports = router;
