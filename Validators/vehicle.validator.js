const Joi = require('joi');

const validationSchema = Joi.object({
  vehicle_type: Joi.string().min(3).max(30).required().messages({
    'any.required': 'Vehicle Name is required',
    'string.min': 'Vehicle Name must have at least 3 characters',
    'string.max': 'Vehicle Name must have at most 30 characters',
  }),
  l_feet: Joi.string().pattern(/^\d*\.?\d+$/).min(2).max(7).required().messages({
    'any.required': 'L-feet is required',
    'string.pattern.base': 'L-feet must be a valid number',
    'string.min': 'L-feet must have at least 2 characters',
    'string.max': 'L-feet must have at most 7 characters',
  }),
  b_feet: Joi.string().pattern(/^\d*\.?\d+$/).min(2).max(7).required().messages({
    'any.required': 'B-feet is required',
    'string.pattern.base': 'B-feet must be a valid number',
    'string.min': 'B-feet must have at least 2 characters',
    'string.max': 'B-feet must have at most 7 characters',
  }),
  h_feet: Joi.string().pattern(/^\d*\.?\d+$/).min(2).max(7).required().messages({
    'any.required': 'H-feet is required',
    'string.pattern.base': 'H-feet must be a valid number',
    'string.min': 'H-feet must have at least 2 characters',
    'string.max': 'H-feet must have at most 7 characters',
  }),
  capacity_kgs: Joi.string().pattern(/^\d*\.?\d+$/).min(3).max(10).required().messages({
    'any.required': 'Capacity is required',
    'string.pattern.base': 'Capacity must be a valid number',
    'string.min': 'Capacity must have at least 3 characters',
    'string.max': 'Capacity must have at most 10 characters',
  }),
  cft: Joi.string().pattern(/^\d*\.?\d+$/).min(2).max(7).required().messages({
    'any.required': 'CFT is required',
    'string.pattern.base': 'CFT must be a valid number',
    'string.min': 'CFT must have at least 2 characters',
    'string.max': 'CFT must have at most 7 characters',
  }),
  cbm: Joi.string().pattern(/^\d*\.?\d+$/).min(2).max(7).required().messages({
    'any.required': 'CBM is required',
    'string.pattern.base': 'CBM must be a valid number',
    'string.min': 'CBM must have at least 2 characters',
    'string.max': 'CBM must have at most 7 characters',
  }),
});

module.exports = validationSchema;
