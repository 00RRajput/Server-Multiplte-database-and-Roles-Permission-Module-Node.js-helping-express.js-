const { Schema, model, Types } = require("mongoose");

const userCustomerSchema = new Schema({
  user_name: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  customer: { type: [Schema.Types.ObjectId], required: true },
  is_active: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  userCustomerSchema,
  userCustomerModel: "UserCustomer",
};
