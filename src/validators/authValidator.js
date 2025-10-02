const Joi = require('joi');

// Signup validation
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional()
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Request password reset
const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required()
});

// Reset password
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Optional: Refresh token / Logout validation
const tokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  signupSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  tokenSchema
};
