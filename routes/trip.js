const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const {authenticateToken}=require("../middlewares/AuthMiddleware");

router.post('/create',authenticateToken, tripController.createTrip);
router.post("/add",tripController.addMembers);
router.get("/tripId/:tripId",tripController.getTripByTripId);
router.post('/addTransaction', tripController.addTransaction);
router.get('/trips', tripController.getAllTrips);
router.get('/settlement/:tripId', tripController.calculateSettlement);
router.put('/trips/:tripId', tripController.editTrip);
router.get('/user/:userId', tripController.getTripsByUserId);
router.get('/trips/user/:userId', tripController.getTripsByUserId);
router.delete('/trips/:tripId', tripController.deleteTrip);
    


module.exports = router;
