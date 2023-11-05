const { Schema, model, Types } = require("mongoose");

const inboundSchema = new Schema({
  appointment_no: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: true },
  document_type: { type: String, required: true },
  creation_date: { type: Date, required: true },
  expected_time: { type: Date, required: true },
  product_qty: [
    {
      id: { type: Number },
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number },
    },
  ],
  document_no: { type: String, required: true },
  document: { type: String, required: true },
  isActive: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  inboundModel: "Inbound",
  inboundSchema,
};
