const Joi = require('joi');

// Schema for creating a SubAdmin
const createSubAdminSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('subAdmin').required(), // always subAdmin
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional()
});

// Schema for updating a SubAdmin
const updateSubAdminSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional()
}).min(1); // At least one field must be provided

module.exports = { createSubAdminSchema, updateSubAdminSchema };
