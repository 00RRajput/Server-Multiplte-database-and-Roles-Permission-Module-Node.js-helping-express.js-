const Joi = require("joi");

const laneSchema = Joi.object({
  from_city: Joi.string().min(3).optional().allow("", null).max(50).label('From City'),
  to_city: Joi.string().min(3).optional().allow("", null).max(50).label('To City'),
  from_lat_lng: Joi.array().optional().allow("", null).label('From Location'),
  to_lat_lng: Joi.array().optional().allow("", null).label('To Location'),
  to_city_id: Joi.number().optional().allow("", null),
  to_state_id: Joi.number().optional().allow("", null),
  from_city_id:Joi.number().optional().allow("", null),
  from_state_id:Joi.number().optional().allow("", null),
  country:Joi.number().optional().allow("", null),
  isActive:Joi.boolean().optional().allow("",null),


  created_by: Joi.string().min(8),
});

module.exports = laneSchema;
