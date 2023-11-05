const { Schema, model } = require("mongoose");

const countrySchema = new Schema({
    country_id: { type: Number, required: true },
    hb_country_id: { type: Number },
    name: { type: String, required: true },
    phone_code: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    timezones: [{
        zoneName: { type: String },
        gmtOffset: { type: Number },
        gmtOffsetName: { type: String },
        abbreviation: { type: String },
        tzName: { type: String }
    }],
    capital: { type: String },
    currency: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
    tld: { type: String },
    iso3: { type: String },
    iso2: { type: String },
    region: { type: String },
    subregion: { type: String },
    emoji: { type: String },
    emojiU: { type: String },
});

countrySchema.index({ location: '2dsphere' });

module.exports = { countrySchema, countryModelName: "Country" };
