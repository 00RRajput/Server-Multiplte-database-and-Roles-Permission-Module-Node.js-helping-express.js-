const { Schema, model } = require("mongoose");

const clientDatabaseSchema = new Schema({
    client_id: { type: Schema.Types.ObjectId, ref: "Client" },
    client_code: { type: String, unique: true },
    db_name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
	created_at: { type: Date },
	updated_at: { type: Date },
});

module.exports = {
	clientDatabaseSchema,
	clientDbModelName: 'ClientDatabase',
};
