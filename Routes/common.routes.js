const express = require('express');
const CommonController = require('../Controllers/common.controller');
const Validator = require('../Middleware/validator.middleware');
const { authJwt } = require('../Middleware/apiAuth.middleware');
const uploadFile = require("../Helpers/file.helper");

const router = express.Router();

router
    .post('/files', authJwt, uploadFile('file'), CommonController.fileUpload);

module.exports = router;
