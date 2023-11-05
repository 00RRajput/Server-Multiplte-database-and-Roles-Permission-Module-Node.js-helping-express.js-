const { Schema, model } = require("mongoose");

const departmentSchema = new Schema({
    department: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});


module.exports = {
    departmentSchema,
	departmentModelName: "Department",
};