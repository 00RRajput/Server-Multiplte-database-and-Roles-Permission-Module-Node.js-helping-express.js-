const express = require("express");
const YardController = require("../Controllers/yard.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require('../Middleware/apiAuth.middleware');

const router = express.Router();

router
    .get('/', authJwt, YardController.index)
    .get('/:id', authJwt, YardController.getSelectedYard)
    .get('/status/:id', authJwt, YardController.changeYardStatus)
    .post('/', authJwt, Validator("yardValidator"), YardController.store)
    .put('/:id', authJwt, Validator("yardValidator"), YardController.update)
    .delete('/:id', authJwt, YardController.destroy);

module.exports = router;