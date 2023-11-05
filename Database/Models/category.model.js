const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema({
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = { categoryModel: "Category", categorySchema };
