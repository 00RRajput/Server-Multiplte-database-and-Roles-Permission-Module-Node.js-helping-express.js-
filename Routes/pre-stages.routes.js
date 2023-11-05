const express = require("express");
const PreStagesController = require("../Controllers/pre-stages.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require('../Middleware/apiAuth.middleware');

const router = express.Router();

router
    .get('/', authJwt, PreStagesController.index)
    .post('/', authJwt, Validator("prestagesValidator"), PreStagesController.store)
    .put('/:id', authJwt, PreStagesController.update)
    .delete('/:id', authJwt, PreStagesController.destroy);

module.exports = router;