const { Schema, model } = require("mongoose");

const rolePermissionsSchema = new Schema({
    permission: { type: String, ref: 'Permission' },
    parent: { type: String, required: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
    status: { type: Boolean, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

module.exports = {
	rolePermissionsSchema,
	rolePermissionsModelName: "RolePermissions",
};