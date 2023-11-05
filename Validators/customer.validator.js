const Joi = require("joi");

const customerSchema = Joi.object({
  customer_name: Joi.string().required(),
  contact_person: Joi.string().required(),
  email: Joi.string().required().lowercase().email(),
  phone_no: Joi.string()
    .required()
    .regex(/^[6-9]\d{9}$/)
    .message("please enter a valid phone number"),
  address: Joi.string().required(),
  location: Joi.array().required(),
  location_name: Joi.array().required(),
  prestages: Joi.string().required(),
  isActive: Joi.boolean().allow("", null).optional(),
});

module.exports = customerSchema;
