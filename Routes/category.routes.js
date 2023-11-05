const express = require("express");
const CategoryController = require("../Controllers/category.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();

router
  .get("/", authJwt, CategoryController.index)
  .post("/", authJwt, Validator("categoryValidator"), CategoryController.store)
  .put("/:id", authJwt, CategoryController.update)
  .delete("/:id", authJwt, CategoryController.destroy);

module.exports = router;
