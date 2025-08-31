// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/watchlistController');

router.post('/:userId', ctrl.add);
router.get('/:userId', ctrl.list);
router.delete('/:id', ctrl.remove);

module.exports = router;
