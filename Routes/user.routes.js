const express = require("express");
const UserController = require("../Controllers/user.controller");
const { authJwt, authorize } = require('../Middleware/apiAuth.middleware');

const router = express.Router();

router
    // .get('/', authJwt, authorize(['SUPER_ADMIN', 'ADMIN', 'DEVELOPER']), UserController.getUsers)
    .get('/', authJwt, UserController.getUsers)
    .get('/holibook', UserController.holibookUser)
    .put('/:id', authJwt, UserController.update)
    .get('/user-fields/:client', authJwt, UserController.getUserFields);

module.exports = router;