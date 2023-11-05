const Joi = require("joi");

const categorySchema = Joi.object({
    category: Joi.string().required(),
    isActive: Joi.boolean().allow("", null).optional()
});

module.exports = categorySchema;