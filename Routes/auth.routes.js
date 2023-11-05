const express = require('express');
const AuthController = require('../Controllers/auth.controller');
const Validator = require('../Middleware/validator.middleware');
const { authJwt, authorize, authApi } = require('../Middleware/apiAuth.middleware');

const router = express.Router();

router
    .get('/', AuthController.generateTokens)
    .get('/logout', authJwt, AuthController.logout)
    .get('/user', authJwt, AuthController.getUser)
    .post('/login', Validator('loginValidator'), AuthController.login)
    // .post("/register", Validator("registerValidator"), authJwt, authorize(["SUPER_ADMIN", "ADMIN"]), AuthController.register)
    .post('/register', authJwt, Validator('registerValidator'), AuthController.register)

module.exports = router;
