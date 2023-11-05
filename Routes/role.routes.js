const express = require("express");
const RoleController = require("../Controllers/role.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

// router.get("/", authJwt, authorize(['ADMIN', 'SUPER_ADMIN', 'WEB_SERVICE', 'DEVELOPER']), RoleController.readRoles)
router.get("/", authJwt, RoleController.readRoles)
    .post("/", authJwt, Validator("roleValidator"), RoleController.createRole)
    .put("/:id", authJwt, Validator("roleValidator"), RoleController.updateRole)
    .delete("/:id", authJwt, authorize(['ADMIN', 'DEVELOPER']), RoleController.removeRole);

module.exports = router;