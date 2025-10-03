const Trip = require('../models/Trip');
const TripTransaction = require('../models/TripTransaction');
const Contact = require("../models/Contact");
const User = require("../models/User");

// ==========================
// CREATE TRIP
// ==========================
exports.createTrip = async (req, res) => {
  try {
    // UserId from token middleware
    const userId = req.user.id;

    const trip = await Trip.create({
      place: req.body.place,
      date: req.body.date,
      userId
    });

    // Add creator as member (assuming User model is associated properly)
    await trip.addMember(userId);

    res.status(201).json({ message: 'Trip created', trip });
  } catch (error) {
    console.error('❌ createTrip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

// ==========================
// ADD MEMBERS (Contact or User)
// ==========================
exports.addMembers = async (req, res) => {
  try {
    const { tripId, contactId, userId } = req.body;

    if (!tripId || (!contactId && !userId)) {
      return res.status(400).json({ message: "TripId and ContactId/UserId required" });
    }

    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (contactId) {
      const contact = await Contact.findByPk(contactId);
      if (!contact) return res.status(404).json({ message: "Contact not found" });
      await trip.addTripContacts(contact); // Use alias from association
    }

    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      await trip.addMember(user); // Use User alias
    }

    res.status(200).json({ message: "Member(s) added successfully" });
  } catch (error) {
    console.error("❌ addMembers error:", error);
    res.status(500).json({ message: "Failed to add members" });
  }
};

// ==========================
// GET TRIP BY ID (with members)
// ==========================
exports.getTripByTripId = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!tripId) return res.status(400).json({ message: "TripId required" });

    const trip = await Trip.findByPk(tripId, {
      include: [
        { model: User, as: "members", attributes: ['id', 'name', 'email'] },
        { model: Contact, as: "tripContacts", attributes: ['id', 'name', 'phone'] }
      ]
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.status(200).json({ trip });
  } catch (error) {
    console.error("❌ getTripByTripId error:", error);
    res.status(500).json({ message: "Failed to get trip" });
  }
};

// ==========================
// ADD TRANSACTION
// ==========================
exports.addTransaction = async (req, res) => {
  try {
    const txn = await TripTransaction.create({
      tripId: req.body.tripId,
      name: req.body.name,
      amount: req.body.amount,
      purpose: req.body.purpose,
      date: req.body.date
    });
    res.status(201).json({ txn });
  } catch (error) {
    console.error("❌ addTransaction error:", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// ==========================
// EDIT TRIP
// ==========================
exports.editTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { place, date } = req.body;

    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (place !== undefined) trip.place = place;
    if (date !== undefined) trip.date = date;

    await trip.save();
    res.status(200).json({ message: 'Trip updated', trip });
  } catch (error) {
    console.error("❌ editTrip error:", error);
    res.status(500).json({ message: "Failed to update trip" });
  }
};

// ==========================
// CALCULATE SETTLEMENT
// ==========================
exports.calculateSettlement = async (req, res) => {
  try {
    const { tripId } = req.params;
    const transactions = await TripTransaction.findAll({ where: { tripId } });

    const total = transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const names = [...new Set(transactions.map(txn => txn.name))];
    const share = total / names.length;

    const paidMap = {};
    names.forEach(n => paidMap[n] = 0);
    transactions.forEach(txn => paidMap[txn.name] += txn.amount);

    const settlement = names.map(name => ({
      name,
      paid: paidMap[name],
      balance: paidMap[name] - share
    }));

    res.status(200).json({ total, share, settlement });
  } catch (error) {
    console.error("❌ calculateSettlement error:", error);
    res.status(500).json({ message: "Failed to calculate settlement" });
  }
};

// ==========================
// GET ALL TRIPS
// ==========================
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    res.status(200).json({ trips });
  } catch (error) {
    console.error("❌ getAllTrips error:", error);
    res.status(500).json({ message: "Failed to get trips" });
  }
};

// ==========================
// GET TRIPS BY USER ID
// ==========================
exports.getTripsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Trip.findAll({ where: { userId } });

    if (!trips.length) return res.status(404).json({ message: 'No trips found' });

    res.status(200).json({ trips });
  } catch (error) {
    console.error("❌ getTripsByUserId error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// DELETE TRIP
// ==========================
exports.deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Delete related transactions first
    await TripTransaction.destroy({ where: { tripId } });
    await trip.destroy();

    res.status(200).json({ message: 'Trip deleted', tripId });
  } catch (error) {
    console.error("❌ deleteTrip error:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};
