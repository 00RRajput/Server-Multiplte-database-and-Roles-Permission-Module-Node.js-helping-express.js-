const express = require("express");
const router = express.Router();

const ConfigurationController = require("../Controllers/configuration.controller");
// const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
    .get("/user-fields", authJwt, ConfigurationController.read)
    .get("/user-field/:id", authJwt, ConfigurationController.readUserField)
    .put("/user-config/:id", authJwt, ConfigurationController.updateUserConfig)
    .get("/menu-list", authJwt, ConfigurationController.menuList);
    
module.exports = router;
