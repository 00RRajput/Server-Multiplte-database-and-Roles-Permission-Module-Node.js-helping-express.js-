const { Schema, model } = require("mongoose");

const userRoleSchema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref: 'User'},
    role_id : {type: Schema.Types.ObjectId, ref: 'Role'},
    priority : {type: Number},
    created_at: { type: Date },
    updated_at: { type: Date }
});

module.exports = { userRoleModelName: "UserRole", userRoleSchema };