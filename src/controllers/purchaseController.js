const Book = require('../models/Book');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// Create Purchase (buy all items in user's cart)
exports.createPurchase = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const purchases = [];
      let totalBooksBought = 0;

      for (const item of cart.items) {
        const bookId = item.book._id;
        const quantity = item.quantity;

        // Atomically decrement stock if enough quantity is available
        const updatedBook = await Book.findOneAndUpdate(
          { _id: bookId, stock: { $gte: quantity } }, // check stock
          { $inc: { stock: -quantity } },             // decrement stock
          { new: true, session }
        );

        if (!updatedBook) {
          throw new Error(`Not enough stock for "${item.book.title}". Available: ${item.book.stock}`);
        }

        // Create purchase record
        const purchase = new Purchase({
          user: userId,
          book: bookId,
          quantity
        });

        await purchase.save({ session });
        purchases.push(purchase);

        totalBooksBought += quantity;
      }

      // Update user's total purchased books count
      await User.findByIdAndUpdate(
        userId,
        { $inc: { booksBoughtAmount: totalBooksBought } },
        { new: true, session }
      );

      // Clear user's cart after successful purchase
      cart.items = [];
      await cart.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: 'Purchase successful', purchases });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get current user's purchases
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user.id }).populate('book');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('user').populate('book');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};