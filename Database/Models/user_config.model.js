const { Schema, model } = require("mongoose");

const userConfigSchema = new Schema({
    type: { type: String, required: true },
    full_name: { type: Boolean, required: true },
    email: { type: Boolean, default: true },
    phone: { type: Boolean, required: true },
    user_name: { type: Boolean, required: true },
    department: { type: Boolean, required: true },
    reporting_manger: { type: Boolean, required: true },
    cost_center: { type: Boolean, required: true },
    home_center: { type: Boolean, required: true },
    role: { type: Boolean, required: true },
    address: { type: Boolean, required: true },
    address_2: { type: Boolean, required: true },
    city: { type: Boolean, required: true },
    state: { type: Boolean, required: true },
    country: { type: Boolean, required: true },
    pincode: { type: Boolean, required: true },
    emergency_contact: { type: Boolean, required: true },
    relation: { type: Boolean, required: true },
    password: { type: Boolean, default: true },
    confirm_password: { type: Boolean, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

module.exports = { userConfigSchema, userConfigModelName: "UserConfig" };