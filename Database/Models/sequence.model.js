const { Schema } = require("mongoose");

const sequenceSchema = new Schema({
    client_seq: { type: Number, default: 0 }
});

module.exports = { sequenceSchema, sequenceSchemaModelName: "Sequence" };
