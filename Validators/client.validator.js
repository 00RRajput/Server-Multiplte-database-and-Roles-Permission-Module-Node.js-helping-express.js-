const Joi = require("joi");

const clientSchema = Joi.object({
  client_name: Joi.string().required(),
  client_user_name: Joi.string().required(),
  client_code: Joi.string().required(),
  msme_no: Joi.string().optional(),
  registration_no: Joi.string().optional(),
  license_no: Joi.string().optional(),
  license_issue_date: Joi.date().optional(),
  license_expiry_date: Joi.date().optional(),
  contact_person_poc: Joi.string().required(),
  poc_mobile: Joi.string().required().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number"),
  poc_other_phone: Joi.string().optional().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number"),
  client_official_mail: Joi.string().required(),
  industry: Joi.string().optional(),
  year_incorporated: Joi.string().optional(),
  business_presence: Joi.string().optional(),
  website: Joi.string().optional(),
  resgister_address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  yard_limitation: Joi.number().required(),
});

module.exports = clientSchema;
