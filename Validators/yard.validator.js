const Joi = require("joi");

const yardSchema = Joi.object({
    id: Joi.string().allow("", null).optional(),
    location: Joi.string().required(),
    customer: Joi.string().required(),
    sections: Joi.array().required(),
    isActive: Joi.boolean().allow("", null).optional()
    // .message('Status must be a boolean'),
});

module.exports = yardSchema;