const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
    role: { type: String, required: true, unique: false },
    department_id: { type: Schema.Types.ObjectId, ref: "Department" },
    priority: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

module.exports = { roleSchema, roleModelName: "Role" };