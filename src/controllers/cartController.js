const Cart = require('../models/Cart');
const Book = require('../models/Book');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
    if (!cart) return res.status(200).json({ items: [] }); // empty cart
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add book to cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (quantity > book.stock) {
      return res.status(400).json({ message: `Cannot add ${quantity} items. Only ${book.stock} in stock.` });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ book: bookId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(i => i.book.toString() === bookId);

      if (itemIndex > -1) {
        // Book exists in cart, calculate new quantity
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > book.stock) {
          return res.status(400).json({ message: `Cannot add ${quantity} items. Total in cart would exceed stock (${book.stock})` });
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        // Book not in cart, add new
        cart.items.push({ book: bookId, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update book quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.book.toString() === bookId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Book not in cart' });

    if (quantity <= 0) {
      // Remove item if quantity <= 0
      cart.items.splice(itemIndex, 1);
    } else if (quantity > book.stock) {
      return res.status(400).json({ message: `Cannot set quantity to ${quantity}. Only ${book.stock} in stock.` });
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Remove a book from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.book.toString() !== bookId);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
