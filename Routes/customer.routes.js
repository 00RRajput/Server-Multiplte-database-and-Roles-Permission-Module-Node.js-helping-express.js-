const express = require("express");
const CustomerController = require("../Controllers/customer.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .get("/", authJwt, CustomerController.index)
  .get("/prestages", authJwt, CustomerController.getPreStagesCustomer)
  .post("/", authJwt, Validator("customerValidator"), CustomerController.store)
  .put("/:id", authJwt, CustomerController.update)
  .delete("/:id", authJwt, CustomerController.destroy);

module.exports = router;
