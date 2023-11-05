const mongoose = require("mongoose");
require("dotenv").config();

const { permissionsSchema } = require("../Models/permissions.model");
const { rolePermissionsSchema } = require("../Models/role_permissions.model");
const { roleSchema } = require("../Models/role.model");

const Permissions = mongoose.model("Permission", permissionsSchema);
const RolePermissions = mongoose.model("RolePermissions",rolePermissionsSchema);
const Role = mongoose.model("Role", roleSchema);
// const { connection } = require("../connection");
const { IST } = require("../../Helpers/dateTime.helper");
const permission = require("../../permission.json");
// const { rolePermissionsSchema } = require("../Models/role_permissions.model");

const { DATABASE } = process.env;

const ModifyName = (name) => {
  const arr = name.split("_");

  //loop through each element of the array and capitalize the first letter.
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  //Join all the elements of the array back into a string
  return arr.join(" ");
};

// seeder data here
const seederData = async (role) => {
  const data = [];
  const superAdminPermission = [];
  let count = 0;
  Object.keys(permission).map((key) => {
    if (key === "super-admin-permissions")
      Object.keys(permission[key]).map((parent) => {
        Object.keys(permission[key][parent]).map((child) => {
          superAdminPermission.push({
            permission: permission[key][parent][child],
            parent: parent,
            role_id: role._id,
            status: true,
            created_at: IST(),
            updated_at: IST(),
          });
        });
      });
    else
      Object.keys(permission[key]).map((k) => {
        count = count + 1;
        data.push({
          permission: count,
          title: permission[key][k],
          display_name: ModifyName(permission[key][k]),
          parent: key,
          parent_name: ModifyName(key),
          created_at: IST(),
          updated_at: IST(),
        });
      });
  });
  return [data, superAdminPermission];
};

const init = async () => {
  try {
    console.log("running seeder !");
    mongoose.connect(DATABASE);
    let role = await Role.findOne({ role: "SUPER-ADMIN" });
    let data = await seederData(role);
    Permissions.deleteMany({}, (error) => {
      if (error) console.log(error);
      else console.log("DONE");
    });
    RolePermissions.deleteMany({}, (error) => {
      if (error) console.log(error);
      else console.log("DONE");
    });
    console.log("adding seeder record/s !");
    await Permissions.insertMany(data[0], (error, docs) => {
      if (error) console.log(error);
      else console.log("DB seed complete");
    });

    await RolePermissions.insertMany(data[1], (error, docs) => {
      if (error) console.log(error);
      else console.log("DB seed complete2");
      process.exit();
    });
    // mongoose.disconnect();
    console.log("running seeder !");
  } catch (error) {
    console.log("Error seeding DB :: ", error?.message);
    process.exit();
  }
};

init();
