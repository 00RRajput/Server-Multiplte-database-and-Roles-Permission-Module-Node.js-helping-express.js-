const Joi = require("joi");

const preStagesSchema = Joi.object({
    id: Joi.string().optional().allow(null, ""),
    location: Joi.string().required(),
    customer: Joi.string().required(),
    form_name: Joi.string().required(),
    checklists: Joi.array().required(),
    isActive: Joi.boolean().optional().allow(null),
});

module.exports = preStagesSchema;