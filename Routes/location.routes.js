const express = require("express");
const router = express.Router();
const LocationController = require("../Controllers/location.controller");
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
  .post("/", LocationController.createLocation)
  .get("/", LocationController.readLocations)
  .get("/admin", authJwt, LocationController.readLocationsForClient)
  .put("/:id", LocationController.updateLocation)
  .get("/country", LocationController.getCountry)
  .get("/state", LocationController.getState)
  .get("/city", LocationController.getCity)
  .get("/by-customer/:id", authJwt, LocationController.getLocationByCustomer);

module.exports = router;
