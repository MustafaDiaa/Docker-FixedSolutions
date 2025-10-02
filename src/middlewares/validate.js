// middlewares/validate.js
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // Forward error to global error handler
    return next({
      status: 400,
      message: 'Validation error',
      details: error.details.map(d => d.message.replace(/"/g, ''))
    });
  }

  next();
};

module.exports = validate;
