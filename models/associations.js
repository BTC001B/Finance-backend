const Trip = require('./Trip');
const Person = require('./Person');
const TripTransaction = require('./TripTransaction');

Trip.hasMany(Person, { foreignKey: 'tripId' });
Person.belongsTo(Trip, { foreignKey: 'tripId' });

Trip.hasMany(TripTransaction, { foreignKey: 'tripId' });
TripTransaction.belongsTo(Trip, { foreignKey: 'tripId' });

Person.hasMany(TripTransaction, { foreignKey: 'personId' });
TripTransaction.belongsTo(Person, { foreignKey: 'personId' });

module.exports = { Trip, Person, TripTransaction };
