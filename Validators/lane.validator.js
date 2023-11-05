const Joi = require("joi");

const laneSchema = Joi.object({
  from_city: Joi.string().min(3).required().max(50).label('From City')
  .messages({
    'any.required': 'From City is required!',
  }),
  to_city: Joi.string().min(3).required().max(50).label('To City')
  .messages({
    'any.required': 'To City is required!',
  }),
  from_lat_lng: Joi.array().required().label('From Location')
  .messages({
    'any.required': 'From Location is required!',
  }),
  to_lat_lng: Joi.array().required().label('To Location')
  .messages({
    'any.required': 'To Location is required!',
  }),
  to_city_id: Joi.number().required(),
  to_state_id: Joi.number().required(),
  from_city_id:Joi.number().required(),
  from_state_id:Joi.number().required(),
  country:Joi.number().required(),


  created_by: Joi.string().min(8),
});

module.exports = laneSchema;
