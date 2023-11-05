const { Schema, model, Types } = require("mongoose");

const preStagesSchema = new Schema({
  location: { type: Schema.Types.ObjectId, required: true, ref:"Location" },
  customer: { type: Schema.Types.ObjectId, required: true, ref:"Customer" },
  form_name: { type: String, required: true },
  checklists: { type: Array, required: true },
  isActive: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  preStagesModel: "PreStages",
  preStagesSchema,
};
