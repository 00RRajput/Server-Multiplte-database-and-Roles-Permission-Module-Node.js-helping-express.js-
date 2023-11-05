const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name : { type: String, required: true },
    email : { type: String },
    phone : { type: Number },
    client_id : {type: Schema.Types.ObjectId},
    user_name : { type: String },
    department : { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    reporting_manager : { type: String },
    cost_center : { type: String },
    home_center : { type: String },
    address_1 : { type: String },
    address_2 : { type: String },
    city : { type: String },
    state : { type: String },
    country : { type: String },
    pin_code : { type: Number },
    emergency_contact : { type: Number },
    relation_contact : { type: Number },
    password : { type: String, required: true },
    role : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    device_token : { type: String },
    refresh_token : { type: String },
    is_deleted: { type: Boolean, default: false },
    activeStatus: { type: Boolean, default: true },
    // activeStatus : { type: String },
    created_at: { type: Date },
    updated_at: { type: Date }
});

module.exports = { userModelName: "User", userSchema };