const Joi = require('joi');
const mongoose = require('mongoose');

// Helper to validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Schema for adding a book to the cart
const addToCartSchema = Joi.object({
  bookId: Joi.string().custom(objectId, 'ObjectId validation').required(),
  quantity: Joi.number().min(1).required()
});

// Schema for updating a cart item quantity
const updateCartItemSchema = Joi.object({
  bookId: Joi.string().custom(objectId, 'ObjectId validation').required(),
  quantity: Joi.number().min(0).required() // 0 will remove the item
});

module.exports = { addToCartSchema, updateCartItemSchema };
