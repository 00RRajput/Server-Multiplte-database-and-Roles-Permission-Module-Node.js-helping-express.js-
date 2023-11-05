const express = require("express");
const DispatchTypeController = require("../Controllers/dispatchtype.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .get("/", authJwt, DispatchTypeController.readDispatchType)
  .post("/", authJwt, DispatchTypeController.createDispatchType)
  .put("/:id", authJwt, DispatchTypeController.updateDispatchType);

module.exports = router;
