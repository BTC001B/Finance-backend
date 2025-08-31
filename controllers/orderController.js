// controllers/orderController.js
const Order = require('../models/Order');
const TradeHistory = require('../models/TradeHistory');
const Holding = require('../models/Holding');
const Position = require('../models/Position');
const Account = require('../models/Account');

async function executeOrderSim(order) {
  // Simulate immediate execution (market order) at a random price.
  const execPrice = parseFloat((Math.random() * 1000 + 100).toFixed(2));
  const qty = order.quantity;

  // create trade history
  const trade = await TradeHistory.create({
    OrderId: order.id,
    executionPrice: execPrice,
    quantity: qty,
    UserId: order.UserId
  });

  // update order
  order.status = 'EXECUTED';
  order.executedAt = new Date();
  await order.save();

  // update holdings (simple LIFO average)
  if(order.side === 'BUY') {
    const holding = await Holding.findOne({ where: { UserId: order.UserId, symbol: order.symbol }});
    if(holding) {
      const totalQty = holding.quantity + qty;
      const totalCost = (holding.avgBuyPrice * holding.quantity) + (execPrice * qty);
      holding.quantity = totalQty;
      holding.avgBuyPrice = totalCost / totalQty;
      await holding.save();
    } else {
      await Holding.create({ UserId: order.UserId, symbol: order.symbol, quantity: qty, avgBuyPrice: execPrice });
    }
  } else if(order.side === 'SELL') {
    const holding = await Holding.findOne({ where: { UserId: order.UserId, symbol: order.symbol }});
    if(holding) {
      holding.quantity = Math.max(0, holding.quantity - qty);
      // if zero, optionally remove or keep with zero quantity
      await holding.save();
    }
  }

  return { trade, execPrice };
}

exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { symbol, side, orderType, quantity, price } = req.body;
    if(!symbol || !side || !orderType || !quantity) return res.status(400).json({ error: 'missing fields' });

    // check funds if BUY
    const account = await Account.findOne({ where: { UserId: userId }});
    if(!account) return res.status(404).json({ error: 'account not found' });

    // VERY simple funds check: require balance >= quantity * priceEstimate
    const priceEstimate = orderType === 'MARKET' ? 100 : price || 100; // placeholder
    const required = quantity * priceEstimate;
    if(side === 'BUY' && account.balance < required) {
      return res.status(400).json({ error: 'insufficient funds (placeholder check)' });
    }

    const order = await Order.create({
      UserId: userId,
      symbol, side, orderType, quantity, price: price || null, status: 'OPEN'
    });

    // For MARKET orders, execute immediately (simulated)
    if(orderType === 'MARKET') {
      const result = await executeOrderSim(order);
      // deduct funds (simple)
      const cost = result.execPrice * quantity;
      account.balance -= cost;
      await account.save();
      res.json({ order, executed: true, executionPrice: result.execPrice });
    } else {
      // For LIMIT/STOPLOSS: leave OPEN (would require market matching engine)
      res.json({ order, executed: false });
    }
  } catch(err){ console.error(err); res.status(500).json({ error: err.message }); }
};

exports.getOpenOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { UserId: req.params.userId, status: 'OPEN' }, order:[['createdAt','DESC']]});
    res.json(orders);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { UserId: req.params.userId }, order:[['createdAt','DESC']]});
    res.json(orders);
  } catch(err){ res.status(500).json({ error: err.message }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.orderId, UserId: req.params.userId }});
    if(!order) return res.status(404).json({ error: 'order not found' });
    if(order.status !== 'OPEN') return res.status(400).json({ error: 'order not open' });
    order.status = 'CANCELLED';
    await order.save();
    res.json({ message: 'cancelled', order });
  } catch(err){ res.status(500).json({ error: err.message }); }
};
