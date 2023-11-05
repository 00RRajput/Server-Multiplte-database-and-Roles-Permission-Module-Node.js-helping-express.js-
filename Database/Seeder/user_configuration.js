
const mongoose = require("mongoose");
require("dotenv").config();

const { userConfigurationSchema } = require("../Models/user_configuration.model");
// const { makeConnection, connection } = require("../connection");

const { IST } = require('../../Helpers/dateTime.helper');
const UserConfiguration = mongoose.model(
	"UserConfiguration",
	userConfigurationSchema,
);
const { DATABASE } = process.env
// seeder data here 
const data = [
    {
        field: "fist_name",
        label: "Full Name",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "email",
        label: "Email",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "phone",
        label: "Phone",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "user_name",
        label: "User Name",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "Department ",
        label: "Department ",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "reporting_manager",
        label: "Reporting Manager",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "cost_center",
        label: "Cost Center",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "home_center",
        label: "Home Center",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "department ",
        label: "Department ",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "role",
        label: "Role",
        visibility: true,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "address_1",
        label: "Address 1",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "address_2",
        label: "Address 2",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "city",
        label: "City",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "state",
        label: "State",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "country",
        label: "Country",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "pincode",
        label: "Pincode",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "emergency_contact",
        label: "Emergency Contact",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "relation",
        label: "Relation",
        visibility: false,
        integration: true,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "password",
        label: "Password",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },
    {
        field: "Confirm_password",
        label: "Confirm Password",
        visibility: true,
        integration: false,
        isActive: true,
        created_at: IST(),
        updated_at: IST()
    },

];

const init = async (data) => {
    try {
        console.log("running seeder !");
        mongoose.connect(DATABASE);
        
        UserConfiguration.deleteMany({},(error) => {
            if (error) { 
                console.log(error);
            } 
            else
            {
                console.log("DONE");
            } 
        });
        console.log("adding seeder record/s !");
        UserConfiguration.insertMany(data, (error, docs) => {
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