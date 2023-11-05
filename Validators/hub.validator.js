const Joi = require("joi");

const hubSchema = Joi.object({
    hubName: Joi.string().min(3).required().max(50).label('Hub Name').messages({
        'string.min': 'Hub name must be at least 3 characters',
      'string.max': 'Hub name cannot exceed 50 characters',
        'any.required': 'Hub Name is required!',
    }),
    lang: Joi.number().required().label('Hub Location').messages({
        'any.required': 'Hub Location is required!',
    }),
    lat: Joi.number().required().label('Hub Location').messages({
        'any.required': 'Hub Location is required!',
    }),
    stateId: Joi.string().min(3).required().max(50),
    countryId: Joi.string().min(3).required().max(50),
    countryID: Joi.number().required(),
    stateID: Joi.number().required(),
    cityID: Joi.number().required(),
});

module.exports = hubSchema;