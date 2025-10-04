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
router.get('/transaction/email/:email',tripController.getAllTransactionsByUserEmail);
router.get('/transaction/email/:email/trip/:tripId',tripController.getAllTransactionsByUserEmail);
router.get("/transaction/trip/:tripId",tripController.getAllTransactionsByTripId);
router.put("/update/transactionid/:transactionId",tripController.updateTransaction);
router.delete("/delete/transactionid/:transactionId",tripController.deleteTransaction);
router.get('/members/:tripId',tripController.getAllMembersInTrip);
router.get('/mytrip/:email',tripController.getMyTrips);

module.exports = router;
