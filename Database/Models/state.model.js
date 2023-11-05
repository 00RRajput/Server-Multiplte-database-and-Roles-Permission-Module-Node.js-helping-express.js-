const { Schema, model } = require("mongoose");

const stateSchema = new Schema({
    state_id: { type: Number, required: true },
    name: { type: String, required: true },
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

stateSchema.index({ location: '2dsphere' });

// const State = model("State", stateSchema);
// module.exports = State;
module.exports = { stateSchema, stateSchemaModelName: "State" };
