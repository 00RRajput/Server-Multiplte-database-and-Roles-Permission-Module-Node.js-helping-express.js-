const express = require("express");
const DispatchCustomerController = require("../Controllers/dispatchcustomer.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .get("/", authJwt, DispatchCustomerController.index)
  .post("/", authJwt, DispatchCustomerController.store)
  .put("/:id", authJwt, DispatchCustomerController.update);

module.exports = router;
