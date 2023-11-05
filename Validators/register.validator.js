const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(3).required().min(3).max(25),
    client: Joi.string().required(),
    user_name: Joi.string().allow("", null).optional(),
    role: Joi.string().optional(),
    department: Joi.string().allow("", null).optional(),
    reporting_manager: Joi.string().optional().allow('', null),
    cost_center: Joi.string().optional().allow('', null),
    phone: Joi.string().required().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number"),
    pin_code: Joi.string().allow("", null).optional(),
    emergency_contact: Joi.string().allow("", null).optional().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number"),
    relation_contact: Joi.string().allow("", null).optional().regex(/^[6-9]\d{9}$/).message("please enter a valid phone number"),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6),
    confirm_password: Joi.string().required().valid(Joi.ref("password")),
    roles: Joi.array().optional().allow('', null),
    address_1: Joi.string().allow("", null).optional(),
    address_2: Joi.string().allow("", null).optional(),
    city: Joi.string().allow("", null).optional(),
    state: Joi.string().allow("", null).optional(),
    country: Joi.string().allow("", null).optional(),
    home_center: Joi.string().allow("", null).optional(),
    // relation_contact: Joi.string().allow("", null).optional(),
    // image: Joi.string().allow("", null).optional(),
});

module.exports = registerSchema;
