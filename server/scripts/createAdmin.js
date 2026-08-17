require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = require('../config/db');

const run = async () => {
  await connectDB();
  const existing = await User.findOne({ email: 'khandelwalyash355@gmail.com' });
  if (existing) {
    existing.role = 'admin';
    existing.isVerified = true;
    existing.approved = true;
    existing.approvalStatus = 'approved';
    existing.password = 'qwerty123';
    await existing.save();
    console.log('✅ Existing user promoted to admin with new password');
  } else {
    await User.create({
      name: 'Admin',
      email: 'khandelwalyash355@gmail.com',
      password: 'qwerty123',
      role: 'admin',
      isVerified: true,
      approved: true,
      approvalStatus: 'approved',
    });
    console.log('✅ Admin user created');
  }
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
