
const mongoose = require("mongoose");
require("dotenv").config();

const { userSchema } = require("../Models/user.model");
const { roleSchema } = require("../Models/role.model");
// const { connection } = require("../connection");
const bcrypt = require("bcrypt");

const { DATABASE } = process.env;

const User = mongoose.model("User", userSchema);
const Role = mongoose.model("Role", roleSchema);

// console.log('sss',bcrypt.hashSync('secret', 10))
// seeder data here 
const data = [
    {
        name : 'Sanjay',
        email : 'sanjay.kumar@coderootz.com',
        phone : 8219393501,
        password : bcrypt.hashSync('secret', 12),
        role : [],
        device_token : null,
        refresh_token : null,
        api_key : null,
        activeStatus : 1,
    },
    {
        name : 'Super Admin',
        email : 'super-admin@logistics.com',
        phone : 8219393501,
        password : bcrypt.hashSync('secret', 12),
        role : [],
        device_token : null,
        refresh_token : null,
        api_key : null,
        activeStatus : 1,
    }
];



const init = async (data) => {
    try {
        console.log("running seeder !");
        mongoose.connect(DATABASE);
        
        User.deleteMany({}, (error) => {
            if (error) { 
                console.log(error);
            }  
        });
        let role = await Role.find({});
        if (!role.length) {
            console.log('No roles found 😭 ! please run role seeder first 😎');
            return process.exit(1);
        }

        const Dev = role.filter((roleItem) => roleItem.role === 'DEVELOPER')
        const SuperAd = role.filter(
            (roleItem) => roleItem.role === "SUPER-ADMIN",
        );

        data[0].role.push(Dev[0]._id || null);
        data[1].role.push(SuperAd[0]._id || null);

        console.log("adding seeder record/s !");
        User.insertMany(data, (error, docs) => {
            if (error) console.log(error);
            else console.log ("DB seed complete ❤️‍🔥");
            process.exit();
        });
        console.log("running seeder !");  
        
    } catch (error) {
        console.log("Error seeding DB :: ", error?.message);
        process.exit();
    } 
};

init(data);
  