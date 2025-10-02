const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['user', 'subAdmin', 'rootAdmin'], 
    default: 'user' 
  },

  phone: { type: String, unique: true, sparse: true },
  dateOfBirth: { type: Date },
  city: { type: String },
  address: { type: String },

  lastOnline: { type: Date, default: Date.now },

  booksBoughtAmount: { type: Number, default: 0 },

  isEmailConfirmed: { type: Boolean, default: false },
  emailConfirmationToken: { type: String, select: false },
  emailConfirmationExpires: { type: Date, select: false },

  refreshTokens: [{
    token: { type: String },
    createdAt: { type: Date, default: Date.now },
    ip: { type: String } // optional: record IP
  }],

}, { timestamps: true });

userSchema.virtual('purchasedBooks', {
  ref: 'Purchase',
  localField: '_id',
  foreignField: 'user'
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
