// routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marketController');

router.get('/:symbol', ctrl.getMarketData);
router.get('/top', ctrl.getTop);

module.exports = router;
