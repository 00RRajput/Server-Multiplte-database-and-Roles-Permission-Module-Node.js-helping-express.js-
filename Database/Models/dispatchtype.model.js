const { Schema, model } = require("mongoose");

const dispatchTypeSchema = new Schema({
  dispatch_type: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

module.exports = {
  dispatchTypeSchema,
  dispatchTypeModel: "DispatchType",
};
