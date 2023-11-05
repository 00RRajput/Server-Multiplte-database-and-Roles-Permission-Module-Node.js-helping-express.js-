const { Schema, model, Types } = require("mongoose");

const dispatchCustomerSchema = new Schema({
  dispatch_type: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true },
  customer_name: { type: String, required: true },
  dispatch_customer: { type: String, required: true },
  //   country: { type: Number, required: true },
  //   country_name: { type: String, required: true },
  state: { type: Number, required: true },
  state_name: { type: String, required: true },
  city: { type: Number, required: true },
  city_name: { type: String, required: true },
  address: { type: String, required: true },
  pin_code: { type: String, required: true },
  gst_no: { type: String, required: true },
  // category: { type: Array, ref: "Product", required: true },
  is_active: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  dispatchCustomerModel: "DispatchCustomer",
  dispatchCustomerSchema,
};
