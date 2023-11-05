const { Schema, model } = require("mongoose");

const userConfigurationSchema = new Schema({
    field: { type: String, required: true },
    label: { type: String, required: true },
    visibility: { type: Boolean, required: true },
    integration: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

module.exports = {
	userConfigurationSchema, userConfigurationModelName: "UserConfiguration",
};