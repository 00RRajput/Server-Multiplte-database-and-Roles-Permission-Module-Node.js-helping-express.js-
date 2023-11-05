const { Schema, model } = require("mongoose");

const citySchema = new Schema({
    city_id: { type: Number },
    name: { type: String, required: true },
    state_id: { type: Number, required: true },
    state_name: { type: String, required: true },
    country_id: { type: Number, required: true },
    country_name: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
});


citySchema.index({ location: '2dsphere' });

// const City = model("City", citySchema);
module.exports = { citySchema,  citySchemaModelName:"City"};
