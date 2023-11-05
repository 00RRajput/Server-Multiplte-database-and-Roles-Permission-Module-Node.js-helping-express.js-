const loginValidator = require("./login.validator");
const roleValidator = require("./role.validator");
const departmentValidator = require("./department.validator");
const registerValidator = require("./register.validator")
const laneValidator = require("./lane.validator")
const clientValidator = require("./client.validator")
const hubValidator = require("./hub.validator")
const vendorValidator = require("./vendor.validator")
const vehicleValidator = require("./vehicle.validator")
const hubupdateValidator = require("./hubupdate.validator")
const laneupdateValidator = require("./laneupdate.validator");
const vendorUpdateValidator = require("./vendorApprove.validator");
const yardValidator = require("./yard.validator");
const categoryValidator = require("./category.validator");
const customerValidator = require("./customer.validator");
const inboundValidator = require("./inbound.validator");
const prestagesValidator = require("./prestages.validator");

module.exports = {
    loginValidator,
    registerValidator,
    roleValidator,
    departmentValidator,
    laneValidator,
    hubValidator,
    vendorValidator,
    vehicleValidator,
    hubupdateValidator,
    laneupdateValidator,
    vendorUpdateValidator,
    clientValidator,
    yardValidator,
    customerValidator,
    categoryValidator,
    inboundValidator,
    prestagesValidator,
};
