const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
    location_name: { type: String },
    address: { type: String, required: true },
    // client_name: {type: String, required: true},
    client: {type: Schema.Types.ObjectId, required: true},
    country: { type: Number, required: true },
    country_name: { type: String, required: true },
    state: { type: Number, required: true },
    state_name: { type: String, required: true },
    city: { type: Number, required: true },
    city_name: { type: String, required: true },
    pin: { type: Number, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});


// const Location = model("Location", locationSchema);
// module.exports = Location;
module.exports = {
    locationSchema,
	locationSchemaName: "Location",
};