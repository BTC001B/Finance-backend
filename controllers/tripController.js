const Trip = require('../models/Trip');
const TripTransaction = require('../models/TripTransaction');
const Contact = require("../models/Contact");
const User = require("../models/User");
const { Op } = require("sequelize");


exports.createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;

    const trip = await Trip.create({
      place: req.body.place,
      date: req.body.date,
      userId,
      participants: { [email]: 0 }   // ✅ Start with owner in dictionary
    });

    res.status(201).json({ message: 'Trip created', trip });
  } catch (error) {
    console.error('❌ createTrip error:', error);
    res.status(500).json({ message: 'Failed to create trip' });
  }
};

exports.addMembers = async (req, res) => {
  try {
    const { tripId, email } = req.body;

    if (!tripId || !email) {
      return res.status(400).json({ message: "TripId and email required" });
    }

    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Ask them to login" });
    }

    // Ensure participants is an object
    let participants = trip.participants || {};

    // Add new member with 0 balance if not already there
    if (!participants[email]) {
      participants[email] = 0;
    }

    // ✅ Force Sequelize to recognize JSONB update
    trip.set('participants', participants);
    trip.changed('participants', true);

    await trip.save();

    res.status(200).json({ 
      message: "Member added successfully", 
      participants: trip.participants, 
      trip 
    });
  } catch (error) {
    console.error("❌ addMembers error:", error);
    res.status(500).json({ message: "Failed to add members" });
  }
};


exports.getTripByTripId = async (req, res) => {
  try {
    const { tripId } = req.params;
    console.log("falls");
    if (!tripId) return res.status(400).json({ message: "TripId required" });

    const trip = await Trip.findByPk(tripId, {
      attributes: ['id', 'place', 'date', 'userId', 'participants', 'createdAt', 'updatedAt']
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.status(200).json({ trip });
  } catch (error) {
    console.log("id",req.params.tripId);
    console.error("❌ getTripByTripId error:", error);
    console.log(req.params.tripId);
    res.status(500).json({ message: "Failed to get trip" });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { tripId, email, amount, purpose, date } = req.body;

    if (!tripId || !email || !amount || !purpose || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trip = await Trip.findByPk(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const user = await User.findOne({ where: { email } });
    const contact = await Contact.findOne({ where: { email } });

    if (!user && !contact) {
      return res.status(404).json({ message: "Email not registered as User or Contact" });
    }

    // Update participants dictionary
    const participants = trip.participants || {};
    participants[email] = (participants[email] || 0) + Number(amount);

    // ✅ Force Sequelize to detect JSONB update
    trip.set("participants", participants);
    trip.changed("participants", true);

    await trip.save();

    // Still log the transaction in TripTransaction
    const txn = await TripTransaction.create({ tripId, email, amount, purpose, date });

    res.status(201).json({ message: "Transaction added", participants: trip.participants });
  } catch (error) {
    console.error("❌ addTransaction error:", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};


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

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    res.status(200).json({ trips });
  } catch (error) {
    console.error("❌ getAllTrips error:", error);
    res.status(500).json({ message: "Failed to get trips" });
  }
};

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


exports.getAllTransactionsByUserEmail = async (req, res) => {
  try {
    const { email, tripId } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const whereClause = { email };
    if (tripId) {
      whereClause.tripId = parseInt(tripId);  // Ensure numeric filter
    }

    const transactions = await TripTransaction.findAll({
      where: whereClause,
      order: [["tripId", "ASC"], ["date", "ASC"]], // sorted by tripId then date
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("❌ getAllTransactionsByUserEmail error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


exports.getAllTransactionsByTripId = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!tripId) {
      return res.status(400).json({ message: "TripId is required" });
    }

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const txn = await TripTransaction.findAll({ where: { tripId } });
    if (!txn || txn.length === 0) {
      return res.status(404).json({ message: "No transactions found for this trip" });
    }

    res.status(200).json({ message: "Fetched successfully", data: txn });
  } catch (error) {
    console.error("❌ getAllTransactionsByTripId error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Need Valid TransactionId" });
    }

    const trans = await TripTransaction.findByPk(transactionId);
    if (!trans) {
      return res.status(404).json({ message: "No Transaction Found" });
    }

    // Update transaction
    await trans.update(req.body);

    return res.status(200).json({
      message: "Transaction Detail Updated Successfully",
      updatedTransaction: trans
    });
  } catch (error) {
    console.error("❌ updateTransaction error:", error);
    return res.status(500).json({ message: "Failed To Update Transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Need Valid TransactionId" });
    }

    const trans = await TripTransaction.findByPk(transactionId);
    if (!trans) {
      return res.status(404).json({ message: "No Transaction Found" });
    }

    await trans.destroy();

    return res.status(200).json({
      message: "Transaction Deleted Successfully",
      deletedTransaction: {
        id: trans.id,
        tripId: trans.tripId,
        email: trans.email,
        amount: trans.amount,
        purpose: trans.purpose,
        date: trans.date
      }
    });
  } catch (error) {
    console.error("❌ deleteTransaction error:", error);
    return res.status(500).json({ message: "Failed To Delete Transaction" });
  }
};


exports.getAllMembersInTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ message: "TripId is required" });
    }

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ensure participants is an object (JSONB)
    const participants = trip.participants || {};

    // Optionally return as array of emails or key-value pairs
    // If you want just emails:
    const memberEmails = Object.keys(participants);

    res.status(200).json({
      tripId: trip.id,
      participants: memberEmails,
      participantsWithAmounts: participants // full dictionary { email: amount }
    });

  } catch (error) {
    console.error("❌ getAllMembersInTrip error:", error);
    res.status(500).json({ message: "Failed to fetch trip members" });
  }
};


exports.getMyTrips = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // If participants is stored as a JSON array column in DB
    const trips = await Trip.findAll({
      where: {
        participants: {
          [Op.contains]: [email] // PostgreSQL JSON/ARRAY operator
        }
      }
    });

    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "No trips found for this email" });
    }

    return res.status(200).json({ trips });
  } catch (error) {
    console.error("❌ getMyTrips error:", error);
    return res.status(500).json({ message: "Failed to fetch trips" });
  }
};

// exports.removePeople = async (req,res)=>{
//   try{
//     const {type, email , tripId} = req.body;
//     if(!type || !email || !tripId){
//       res.status(400).json({message:"required all fields"})
//     }
//     const trip = await Trip.findByPk(tripId);
//     if(!trip){
//       res.status(404).json({message:"No Trip Found"});
//     }
//     const amountpaid = await trip.participants[email].value();
//     if(type=='split'){
//         const participants = trip.participants || {};
//         const total = Object.values(participants).reduce((sum, val) => sum + Number(val), 0);
//         const each = total / participants.length();
//         let toBe = each - amountpaid;
//         if(toBe){

//         }
//     }
//   }
// }





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
