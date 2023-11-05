const express = require("express");
const router = express.Router();

const ClientController = require("../Controllers/client.controller");
const Validator = require("../Middleware/validator.middleware");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");


// const multer=require('multer');
// const app = express();
// const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({extended:true}));
// const storage = multer.memoryStorage();

// var upload = multer({storage:storage});

router
    .get("/", authJwt, ClientController.read)
    .get("/get-client/:id", authJwt, ClientController.getClient)
    .put("/:id", authJwt, ClientController.update)
    .post("/", authJwt, Validator('clientValidator'), ClientController.create);

module.exports = router;
