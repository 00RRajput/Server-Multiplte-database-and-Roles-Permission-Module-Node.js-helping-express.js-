const { Schema, model, Types } = require("mongoose");

const customerProductSchema = new Schema({
  customer_name: { type: String, required: true },
  product: { type: [Schema.Types.ObjectId], required: true },
  customer_id: { type: Schema.Types.ObjectId, required: true },
  is_active: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  customerProductSchema,
  customerModelName: "CustomerProduct",
};
