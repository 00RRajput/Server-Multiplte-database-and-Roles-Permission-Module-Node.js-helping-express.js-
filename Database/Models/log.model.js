const { Schema, model } = require("mongoose");

const logSchema = new Schema({
    text: { type: String, required: true },
    error:{ type: Object },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    by: { type: String, default: 'user' },
    created_at: { type: Date, required: true }
});

module.exports = { logSchema, logModelName: "Log" };
