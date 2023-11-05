const express = require("express");
const router = express.Router();

const PermissionController = require("../Controllers/permission.controller");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
    .get("/permissions", authJwt, PermissionController.getPermission)
    .get("/", authJwt, PermissionController.readPermission)
    .get("/role-permission", authJwt, PermissionController.readRolePermission)
    .post("/store", authJwt, PermissionController.store);

module.exports = router;
