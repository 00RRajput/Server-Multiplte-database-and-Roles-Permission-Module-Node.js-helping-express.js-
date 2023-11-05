const { Schema, model, Types } = require("mongoose");

const customerSchema = new Schema({
  customer_name: { type: String, required: true },
  contact_person: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone_no: { type: Number, required: true },
  location: [{ type: Schema.Types.ObjectId, ref: "Location" }],
  location_name: [{ type: String }],
  prestages: { type: String, required: true },
  is_active: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = { customerModel: "Customer", customerSchema };
