const express = require("express");
const router = express.Router();

const ProductController = require("../Controllers/product.controller");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
    .get("/", authJwt, ProductController.readProducts)
    .post("/", authJwt, ProductController.createProduct)
    .put("/:id",authJwt,ProductController.updateProducts);

module.exports = router;