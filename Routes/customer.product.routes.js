const express = require("express");
const ProductCustomerMap = require("../Controllers/customer.product.mapping");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .post("/", authJwt, ProductCustomerMap.createProductCustomer)
  .get("/", authJwt, ProductCustomerMap.readProductCustomer)
  .put("/:id", authJwt, ProductCustomerMap.updateProductMap)
  .get("/by-customer/:id", authJwt, ProductCustomerMap.getCustomerProduct)
  .get("/by-location/:id", authJwt, ProductCustomerMap.getLocationCustomer);

module.exports = router;
