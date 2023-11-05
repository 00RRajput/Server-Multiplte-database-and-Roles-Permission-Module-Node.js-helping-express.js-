const Joi = require("joi");

const inboundSchema = Joi.object({
  customer: Joi.string().required().min(3).message("Customer is required"),
  document_type: Joi.string().required().min(1),
  creation_date: Joi.string().allow("", null).optional(),
  expected_time: Joi.string().allow("", null).optional(),
  document_no: Joi.string().required(),
  document_img: Joi.string(),
  product_qty: Joi.array().required(),
  isActive: Joi.boolean().optional().allow(null),
});

module.exports = inboundSchema;
