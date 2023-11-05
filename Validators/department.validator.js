const Joi = require("joi");

const roleSchema = Joi.object({
  department: Joi.string().required().min(3),
  isActive: Joi.boolean().optional().allow(null),
});

module.exports = roleSchema;
