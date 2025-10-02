require('dotenv').config({path: '../../.env'});
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 12;

const ROOT_ADMINS = [
  { name: 'Root Admin', email: 'adminMustafa@bookly.com', password: 'Mustafa@123' }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (const a of ROOT_ADMINS) {
      const exists = await User.findOne({ email: a.email });
      if (exists) {
        console.log(`Root admin ${a.email} already exists`);
        continue;
      }
      const hashed = await bcrypt.hash(a.password, SALT_ROUNDS);
      await User.create({
        name: a.name,
        email: a.email,
        password: hashed,
        role: 'rootAdmin',
        isEmailConfirmed: true // seed confirmed
      });
      console.log(`Seeded ${a.email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
