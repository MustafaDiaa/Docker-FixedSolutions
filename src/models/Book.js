const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  publishedDate: { type: Date },
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
