const { Schema, model, Types } = require("mongoose");

const yardSchema = new Schema({
  // yardname: { type: String, required: true },
  location: { type:Schema.Types.ObjectId, ref: "Location" },
  customer: { type:Schema.Types.ObjectId, ref: "Customer" },
  isActive: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = { yardModelName: "Yard", yardSchema };
