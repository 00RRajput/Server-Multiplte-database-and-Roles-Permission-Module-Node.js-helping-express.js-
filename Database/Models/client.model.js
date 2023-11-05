const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
    client_name : { type: String, required: true },
    client_user_name : { type: String, required: true, unique: true },
    client_code: { type: String, required: true },
    msme_no: { type: String, default: null },
    registration_no: { type: String, default: null },
    license_no: { type: String, default: null },
    license_issue_date: { type: Date, default: null },
    license_expiry_date: { type: Date, default: null },
    contact_person_poc: { type: String, default: null },
    poc_mobile: { type: Number, default: null },
    poc_other_phone: { type: Number, default: null },
    client_official_mail: { type: String, required: true },
    industry: { type: String, default: null },
    year_incorporated: { type: String, default: null },
    business_presence: { type: String, default: null },
    website: { type: String, default: null },
    resgister_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: Number, required: true },
    yard_limitation: {type: Number, required: true, default: 0},
    url: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    created_at: { type: Date },
    updated_at: { type: Date }
});

module.exports = { clientSchema, clientModelName: "Client" };