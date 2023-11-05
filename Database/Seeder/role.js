
const mongoose = require("mongoose");
require("dotenv").config();

const { roleSchema } = require("../Models/role.model");
// const { connection } = require("../connection");

const Role = mongoose.model("Role", roleSchema);
const { IST } = require('../../Helpers/dateTime.helper');

const { DATABASE } = process.env;
// seeder data here 
const data = [
    {
        role: "DEVELOPER",
        isActive: true,
        created_at: IST(),
        updated_at: IST(),
        priority: 0
    },
    {
        role: "SUPER-ADMIN",
        isActive: true,
        created_at: IST(),
        updated_at: IST(),
        priority: 1
    }
];

const init = async (data) => {
    try {
        console.log("running seeder !");
        mongoose.connect(DATABASE);

        Role.deleteMany({},(error) => {
            if (error) { 
                console.log(error);
            } 
            else
            {
                console.log("DONE");
            } 
        });
        console.log("adding seeder record/s !");
        Role.insertMany(data, (error, docs) => {
            if (error) console.log(error);
            else console.log("DB seed complete");
            mongoose.disconnect();
            process.exit();
        });

        console.log("running seeder !");   
    } catch (error) {
        console.log("Error seeding DB :: ", error?.message);
        process.exit();
    } 
};

init(data);