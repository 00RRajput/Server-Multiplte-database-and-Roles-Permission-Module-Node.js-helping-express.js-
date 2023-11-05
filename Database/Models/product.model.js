const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_desc: { type: String, required: true },
  product_type: { type: Schema.Types.ObjectId, required: true },
  // product_type_name: { type: String, required: true },
  isActive: { type: Boolean },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});
// const Product= model("Product", productSchema);
module.exports = { productSchema, productSchemaModelName: "Product" };
