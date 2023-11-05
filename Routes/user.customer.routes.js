const express = require("express");
const UserCustomerMap = require("../Controllers/user.customer.mapping");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .post("/", authJwt, UserCustomerMap.createUserCustomer)
  .get("/", authJwt, UserCustomerMap.readUserCustomer)
  .put("/:id", authJwt, UserCustomerMap.updateUserMap);

module.exports = router;
