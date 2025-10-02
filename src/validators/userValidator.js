const Joi = require('joi');
const mongoose = require('mongoose');

// Helper to validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Update current user profile
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/),
  city: Joi.string().max(50),
  address: Joi.string().max(255),
  dateOfBirth: Joi.date().less('now')
});

// Change password
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required()
});

// Admin: create or update a user
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'subAdmin', 'rootAdmin').required(),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/),
  city: Joi.string().max(50),
  address: Joi.string().max(255),
  dateOfBirth: Joi.date().less('now')
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid('user', 'subAdmin', 'rootAdmin'),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/),
  city: Joi.string().max(50),
  address: Joi.string().max(255),
  dateOfBirth: Joi.date().less('now')
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  objectId
};
