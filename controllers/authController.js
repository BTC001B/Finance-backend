const User = require('../models/User');
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// SEND OTP
exports.sendOTP = async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60000); // expires in 5 mins

  try {
    let user = await User.findOne({ where: { mobile } });

    if (!user) {
      user = await User.create({ mobile, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    // Send SMS
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${mobile}`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ where: { mobile } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: 'OTP expired' });

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'OTP verified successfully. Login success.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
