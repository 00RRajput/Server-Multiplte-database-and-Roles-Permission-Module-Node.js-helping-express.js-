const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//? custom req middlewares
const ReqLogger = require("./Middleware/reqLogger.middleware");
const checkReqMethod = require("./Middleware/reqMethod.middleware");

const app = express();

//! request security middlewares
app.use(helmet());
app.use(xss());
app.use(cors({
    origin: process.env.CORS_URLS.split(", "),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ['x-server-errortype']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(ReqLogger);
app.use(checkReqMethod);
app.use(express.static('Public'))

module.exports = app;