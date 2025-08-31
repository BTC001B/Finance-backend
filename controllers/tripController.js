const Trip = require('../models/Trip');
const TripTransaction = require('../models/TripTransaction');

// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      place: req.body.place,
      date: req.body.date,
      members: req.body.members,
      userId:req.body.userId// ➡️ add this line
    });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const txn = await TripTransaction.create({
      tripId: req.body.tripId,
      name: req.body.name,
      amount: req.body.amount,
      purpose: req.body.purpose,
      date: req.body.date
    });
    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Trip Details (including members)
exports.editTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Update fields (place, date, members)
    const { place, date, members } = req.body;

    if (place !== undefined) trip.place = place;
    if (date !== undefined) trip.date = date;
    if (members !== undefined) trip.members = members; // assuming JSON array

    await trip.save();

    res.json({ 
      message: 'Trip updated successfully', 
      trip: {
        id: trip.id,
        place: trip.place,
        date: trip.date,
        members: trip.members,
        userId: trip.userId // Added here
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Calculate Settlement
exports.calculateSettlement = async (req, res) => {
  try {
    const tripId = req.params.tripId;

    const transactions = await TripTransaction.findAll({ where: { tripId } });

    // Calculate total expense
    const total = transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const names = [...new Set(transactions.map(txn => txn.name))];
    const share = total / names.length;

    // Calculate per person paid
    const paidMap = {};
    names.forEach(n => paidMap[n] = 0);
    transactions.forEach(txn => paidMap[txn.name] += txn.amount);

    const settlement = names.map(name => ({
      name,
      paid: paidMap[name],
      balance: paidMap[name] - share
    }));

    res.json({
      total,
      share,
      settlement
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTripsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Trip.findAll({ where: { userId } });

    if (!trips.length) {
      return res.status(404).json({ message: 'No trips found for this user' });
    }

    res.json(trips);
  } catch (error) {
    console.error('❌ Error fetching trips by userId:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // First delete related transactions
    await TripTransaction.destroy({ where: { tripId } });

    // Then delete the trip
    await trip.destroy();

    res.json({ message: 'Trip deleted successfully', tripId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
