const express = require("express");
const UserLocationMapController = require("../Controllers/user.location.mapping");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .post("/", authJwt, UserLocationMapController.store)
  .get("/", authJwt, UserLocationMapController.index)
  .put("/:id", authJwt, UserLocationMapController.update);

module.exports = router;
