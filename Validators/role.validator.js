const Joi = require("joi");

const roleSchema = Joi.object({
    role: Joi.string().required().min(3),
    department: Joi.string().allow("", null).optional(),
    isActive: Joi.boolean().optional().allow(null),
});

module.exports = roleSchema;