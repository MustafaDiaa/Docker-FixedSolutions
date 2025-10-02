const Joi = require('joi');

// Schema for adding a new book
const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  author: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(1000).optional(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).optional(),
  publishedDate: Joi.date().optional(),
  category: Joi.string().max(100).optional()
});

// Schema for updating a book
const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  author: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(1000).optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).optional(),
  publishedDate: Joi.date().optional(),
  category: Joi.string().max(100).optional()
}).min(1); // At least one field required for update

module.exports = { createBookSchema, updateBookSchema };
