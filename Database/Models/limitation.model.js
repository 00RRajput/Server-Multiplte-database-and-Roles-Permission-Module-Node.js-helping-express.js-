const { Schema, model, Types } = require("mongoose");

const limitationSchema = new Schema({
    type: {type: String, required:true},
    limit:{type:Number, required:true},
    created_at: { type: Date },
    updated_at: { type: Date }
});

module.exports = { limitationSchema, limitationModelName: "Limitation" };
