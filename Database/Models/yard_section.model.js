const { Schema, model, Types } = require("mongoose");

const yardSectionSchema = new Schema({
    yard_id: {type: Schema.Types.ObjectId, ref: 'Yard'},
    id:{type:Number},
    name:{type:String},
    capacity:{type:String},
    product: { type:Schema.Types.ObjectId, ref: "Product" },
    isActive:{type:Boolean, default:true},
    created_at: { type: Date },
    updated_at: { type: Date }
});

// yardSectionSchema.index({ location: '2dsphere' });

module.exports = { yardSectionModelName: "YardSection", yardSectionSchema };
