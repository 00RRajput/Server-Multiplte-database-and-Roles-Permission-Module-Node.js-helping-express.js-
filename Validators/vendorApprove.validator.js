const Joi = require("joi");

const vendorUpdateSchema = Joi.object({
    approved: Joi.boolean().required(),
    rejection_reason: Joi.string().when("approved", {
        is: false,
        then: Joi.string()
            .required()
            .messages({
                "any.required": "Rejection reason is required !",
            }),
        otherwise: Joi.optional().allow(""),
    })
});

module.exports = vendorUpdateSchema;
