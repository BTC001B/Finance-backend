const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

// ========================
// ✅ Middleware
// ========================
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("Server is up and running ✅"));

// ========================
// 📦 Models
// ========================
const User = require('./models/User');
const Account = require('./models/Account');
const Watchlist = require('./models/Watchlist');
const Order = require('./models/Order');
const Holding = require('./models/Holding');
const Position = require('./models/Position');
const FundTransaction = require('./models/FundTransaction');
const TradeHistory = require('./models/TradeHistory');
const TradeTransaction = require('./models/TradeTransaction');

const Item = require('./models/Item');
const Transaction = require('./models/Transaction');
const Contact = require('./models/Contact');
const ContactTransaction = require('./models/ContactTransaction');
const Trip = require('./models/Trip');
const TripTransaction = require('./models/TripTransaction');

const accountRoutes = require('./routes/accountRoutes');

// ========================
// 🔗 Associations
// ========================

// Inventory
Transaction.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(Transaction, { foreignKey: 'itemId' });

// Contact finance
ContactTransaction.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasMany(ContactTransaction, { foreignKey: 'contactId' });

// Trip transactions
TripTransaction.belongsTo(Trip, { foreignKey: 'tripId' });
Trip.hasMany(TripTransaction, { foreignKey: 'tripId' });

// Trip members (Users)
Trip.belongsToMany(User, { through: "TripMembers", as: "members", foreignKey: "tripId" });
User.belongsToMany(Trip, { through: "TripMembers", as: "trips", foreignKey: "userId" });

// Optional: Trip ↔ Contact if needed
Trip.belongsToMany(Contact, { through: "TripContacts", as: "tripContacts", foreignKey: "tripId" });
Contact.belongsToMany(Trip, { through: "TripContacts", as: "contactsTrips", foreignKey: "contactId" });

// Trading
User.hasOne(Account, { foreignKey: 'userId' });
Account.belongsTo(User, { foreignKey: 'userId' });

Account.hasMany(TradeTransaction, { foreignKey: 'accountId' });
TradeTransaction.belongsTo(Account, { foreignKey: 'accountId' });

User.hasMany(Watchlist);
Watchlist.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Holding);
Holding.belongsTo(User);

User.hasMany(Position);
Position.belongsTo(User);

User.hasMany(FundTransaction);
FundTransaction.belongsTo(User);

Order.hasMany(TradeHistory);
TradeHistory.belongsTo(Order);
TradeHistory.belongsTo(User);

// ========================
// 🔄 Sync Models
// ========================
sequelize
  .sync({ alter: true })
  .then(() => console.log('✅ All models synced'))
  .catch(err => console.error('❌ Sync error:', err));

// ========================
// 🚏 Routes
// ========================
app.use('/api/data/inventory', require('./routes/inventory'));
app.use('/api/data/transactions', require('./routes/transactions'));
app.use('/api/data/trip', require('./routes/trip'));
app.use('/api/data/people', require('./routes/people'));
app.use('/api/data/contacts', require('./routes/contactRoutes'));
app.use('/api/data/goals', require('./routes/goalRoutes'));
app.use('/api/data/account', accountRoutes);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/trade/transactions', require('./routes/tradeTransactionRoutes'));

// ========================
// 🚀 Start Server
// ========================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
