const {
  dispatchCustomerModel,
} = require("../Database/Models/dispatchcustomer.model");
const DB = require("../Helpers/crud.helper");
const Response = require("../Helpers/response.helper");
const { IST } = require("../Helpers/dateTime.helper");
const mongoose = require("mongoose");

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const index = async (req, res, next) => {
  try {
    let query = {};
    let customers = await DB.read(
      req.auth.client_db,
      dispatchCustomerModel,
      query
    );
    return Response.success(res, {
      data: { customers },
      count: customers.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const store = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.is_active = true;
    req.body.created_at = IST();
    req.body.updated_at = IST();

    let customer = await DB.create(req.auth.client_db, dispatchCustomerModel, {
      ...req.body,
    });
    return Response.success(res, { customer });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const update = async (req, res, next) => {
  try {
    console.log("req.bodyin up", req.body, req.params);
    let data = {};
    if (req.body.dispatch_type) data.dispatch_type = req.body.dispatch_type;
    if (req.body.customer) data.customer = req.body.customer;
    if (req.body.customer_name) data.customer_name = req.body.customer_name;
    if (req.body.dispatch_customer)
      data.dispatch_customer = req.body.dispatch_customer;
    if (req.body.address) data.address = req.body.address;
    // if (req.body.country) data.country = req.body.country;
    // if (req.body.country_name) data.country_name = req.body.country_name;
    if (req.body.state) data.state = req.body.state;
    if (req.body.state_name) data.state_name = req.body.state_name;
    if (req.body.city) data.city = req.body.city;
    if (req.body.city_name) data.city_name = req.body.city_name;
    if (req.body.pin_code) data.pin_code = req.body.pin_code;
    if (req.body.gst_no) data.gst_no = req.body.gst_no;
    if ("isActive" in req.body) data.is_active = req.body.isActive;

    req.body.updated_at = IST();
    console.log("dtmade", data);
    await DB.update(req.auth.client_db, dispatchCustomerModel, {
      query: { _id: req.params.id },
      data,
    });

    return Response.success(res, {});
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const destroy = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error);
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
};
