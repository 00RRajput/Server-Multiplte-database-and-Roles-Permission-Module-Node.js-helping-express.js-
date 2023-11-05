const { Schema, model, Types } = require("mongoose");

const userLocationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  // user_name: { type: String, required: true },
  location_id: { type: Schema.Types.ObjectId, required: true },
  // location: { type: Object, required: true },
  isActive: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = {
  userLocationSchema,
  userLocationModel: "UserLocation",
};
