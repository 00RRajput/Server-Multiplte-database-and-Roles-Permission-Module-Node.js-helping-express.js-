const mongoose = require("mongoose");

// Connect to the source and destination MongoDB databases
const sourceDB = mongoose.createConnection(
  "mongodb://freight:7Fg2eNv6gZYJZ94m3zVCT2bYJvZFETy@91.203.133.60:27017/freight",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const destinationDB = mongoose.createConnection(
  "mongodb://localhost:27017/e-logistics",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// console.log(sourceDB);
// Define Mongoose models for your source and destination schemas
const { stateSchema } = require("./Database/Models/state.model");
const Country = sourceDB.model("State", stateSchema); // Replace with your source schema and model
const CountryDest = destinationDB.model("State", stateSchema); // Replace with your destination schema and model

async function moveData() {
  try {
    // Fetch data from the source database
    const sourceData = await Country.find();

    // Transform the data if needed
    const transformedData = sourceData.map((item) => {
    //   return {
    //     // Modify this to match the destination schema
    //     country_id: item.country_id,
    //     name: item.name,
    //     phone_code: item.phone_code,
    //     location: {
    //       type: item.location.type,
    //       coordinates: item.location.coordinates,
    //     },
    //     timezones: item.timezones.map((timezone) => ({
    //       zoneName: timezone.zoneName,
    //       gmtOffset: timezone.gmtOffset,
    //       gmtOffsetName: timezone.gmtOffsetName,
    //       abbreviation: timezone.abbreviation,
        //   tzName: timezone.tzName,
        // })),
        // capital: item.capital,
        // currency: item.currency,
        // currency_name: item.currency_name,
        // currency_symbol: item.currency_symbol,
        // tld: item.tld,
        // iso3: item.iso3,
        // iso2: item.iso2,
        // region: item.region,
        // subregion: item.subregion,
        // emoji: item.emoji,
        // emojiU: item.emojiU,
        // hb_country_id: item.hb_country_id,
        return {
            state_id: item.state_id,
            name: item.name,
            country_id: item.country_id,
            country_name: item.country_name,
            location: {
              type: item.location.type,
              coordinates: item.location.coordinates
            },
          };
        // return {
        //     city_id: item.city_id,
        //     name: item.name,
        //     state_id: item.state_id,
        //     state_name: item.state_name,
        //     country_id: item.country_id,
        //     country_name: item.country_name,
        //     location: {
        //       type: item.location.type,
        //       coordinates: item.location.coordinates
        //     },
        //   };
        // }
    //   };
    });
    // Insert the transformed data into the destination database
    await CountryDest.insertMany(transformedData);
    console.log("Data moved successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the database connections
    sourceDB.close();
    destinationDB.close();
  }
}

// Call the function to move data from source to destination database
moveData();