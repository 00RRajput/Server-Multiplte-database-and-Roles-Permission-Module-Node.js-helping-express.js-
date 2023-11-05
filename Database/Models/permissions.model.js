const { Schema, model } = require("mongoose");

const permissionsSchema = new Schema({
    permission: { type: Number, required: true },
    title: { type: String, required: true },
    display_name: { type: String, required: true },
    parent: { type: String, required: true },
    parent_name: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});


module.exports = { permissionsSchema, permissionsModelName: "Permissions"};