//! client schemas
const { departmentSchema } = require("./Models/department.model");
const { logSchema } = require("./Models/log.model");
const { userSchema } = require("./Models/user.model");
const { limitationSchema } = require("./Models/limitation.model");
const { customerSchema } = require("./Models/customer.model");

//! common schema
const { roleSchema } = require("./Models/role.model");
const { userConfigSchema } = require("./Models/user_config.model");

//! admin schemas
const { clientDatabaseSchema } = require("./Models/client_database.model");
const { clientSchema } = require("./Models/client.model");
const { countrySchema } = require("./Models/country.model");
const { stateSchema } = require("./Models/state.model");
const { citySchema } = require("./Models/city.model");
const { locationSchema } = require("./Models/location.model");
const { permissionsSchema } = require("./Models/permissions.model");
const { rolePermissionsSchema } = require("./Models/role_permissions.model");
const { sequenceSchema } = require("./Models/sequence.model");
const { productSchema } = require("./Models/product.model");
const { yardSchema } = require("./Models/yard.model");
const { yardSectionSchema } = require("./Models/yard_section.model");
const { categorySchema } = require("./Models/category.model");
const { customerProductSchema } = require("./Models/customer.product.model");
const { userCustomerSchema } = require("./Models/user.customer.model");
const { dispatchTypeSchema } = require("./Models/dispatchtype.model");
const { dispatchCustomerSchema } = require("./Models/dispatchcustomer.model");
const { userLocationSchema } = require("./Models/user.location.model");
const { inboundSchema } = require("./Models/inbound.model");
const { preStagesSchema } = require("./Models/pre-stages.model");

const ClientModels = {
  departmentSchema,
  logSchema,
  roleSchema,
  userSchema,
  permissionsSchema,
  rolePermissionsSchema,
  limitationSchema,
  productSchema,
  yardSchema,
  customerSchema,
  userConfigSchema,
  categorySchema,
  yardSectionSchema,
  customerSchema,
  userConfigSchema,
  categorySchema,
  customerProductSchema,
  userCustomerSchema,
  dispatchTypeSchema,
  dispatchCustomerSchema,
  userLocationSchema,
  locationSchema,
  inboundSchema,
  preStagesSchema,
};

const AdminModels = {
  clientDatabaseSchema,
  clientSchema,
  countrySchema,
  stateSchema,
  citySchema,
  permissionsSchema,
  rolePermissionsSchema,
  roleSchema,
  logSchema,
  sequenceSchema,
  locationSchema,
  customerProductSchema,
};

const registerClientModel = (connection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const modelKeys = Object.keys(ClientModels);
      const schema = Object.values(ClientModels);

      modelKeys.map((key, index) => {
        let modelName = key.replace("Schema", "");
        modelName = `${modelName[0].toUpperCase()}${modelName.substring(1)}`;
        return connection.model(modelName, schema[index]);
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const registerAdminModel = (connection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const modelKeys = Object.keys(AdminModels);
      const schema = Object.values(AdminModels);

      modelKeys.map((key, index) => {
        let modelName = key.replace("Schema", "");
        modelName = `${modelName[0].toUpperCase()}${modelName.substring(1)}`;
        return connection.model(modelName, schema[index]);
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { registerClientModel, registerAdminModel };
