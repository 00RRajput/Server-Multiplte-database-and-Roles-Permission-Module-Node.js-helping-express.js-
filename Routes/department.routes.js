const express = require("express");
const DepartmentController = require("../Controllers/department.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .get("/", authJwt, DepartmentController.readDepartment)
  .post(
    "/",
    authJwt,
    Validator("departmentValidator"),
    DepartmentController.createDepartment
  )
  .put("/:id", authJwt, DepartmentController.updateDepartment);

module.exports = router;
