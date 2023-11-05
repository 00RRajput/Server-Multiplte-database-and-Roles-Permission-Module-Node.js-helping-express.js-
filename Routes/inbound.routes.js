const express = require("express");
const multer = require("multer");

const inboundController = require("../Controllers/inbound.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

const router = express.Router();
const upload = multer();

// router.get("/", authJwt, authorize(['ADMIN', 'SUPER_ADMIN', 'WEB_SERVICE', 'DEVELOPER']), inboundController.readRoles)
router.get("/", authJwt, inboundController.index)
    .post("/", authJwt, upload.single('document_img'), Validator("inboundValidator"), inboundController.store)
    .put("/:id", authJwt, upload.single('document_img'), Validator("inboundValidator"), inboundController.update)
    .delete("/:id", authJwt, authorize(['ADMIN', 'DEVELOPER']), inboundController.destroy);

module.exports = router;