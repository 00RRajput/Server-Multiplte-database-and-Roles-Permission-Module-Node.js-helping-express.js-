const Joi = require("joi");

const hubSchema = Joi.object({
    hubName: Joi.string().min(3).optional().max(50).label('Hub Name').messages({
        'string.min': 'Hub name must be at least 3 characters',
      'string.max': 'Hub name cannot exceed 50 characters',
    }),
    lang: Joi.number().optional().allow("", null).label('Hub Location'),
    lat: Joi.number().optional().allow("", null).label('Hub Location'),
    stateId: Joi.string().min(3).optional().allow("", null).max(50),
    countryId: Joi.string().min(3).optional().allow("", null).max(50),
    countryID: Joi.number().optional().allow("", null),
    stateID: Joi.number().optional().allow("", null),
    cityID: Joi.number().optional().allow("", null),
    isActive: Joi.boolean().optional().allow("", null)
});

module.exports = hubSchema;