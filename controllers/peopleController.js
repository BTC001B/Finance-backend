const People = require('../models/People');
const PeopleTransaction = require('../models/PeopleTransaction');

// 1. Create Person
exports.createPerson = async (req, res) => {
  try {
    const { name, expenses, userId } = req.body; // ✅ userId added
    const person = await People.create({ name, expenses, userId });
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Add Transaction for Person
exports.addTransaction = async (req, res) => {
  try {
    const { peopleId, amount, purpose, date } = req.body;

    const transaction = await PeopleTransaction.create({
      peopleId,
      amount,
      purpose,
      date
    });

    // Update person's expenses
    const person = await People.findByPk(peopleId);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    person.expenses += amount;
    await person.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Each Person Expenses
exports.getAllPeopleExpenses = async (req, res) => {
  try {
    const people = await People.findAll({
      include: [PeopleTransaction]
    });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get People by UserId ✅
exports.getPeopleByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const people = await People.findAll({
      where: { userId },
      include: [PeopleTransaction]
    });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
