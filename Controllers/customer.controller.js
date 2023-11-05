const { customerModel } = require("../Database/Models/customer.model");
const { locationSchemaName } = require("../Database/Models/location.model");
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
    let pipeLine = [
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locations",
        },
      },
    ];
    let customers = await DB.aggregation(
      req.auth.client_db,
      customerModel,
      pipeLine
    );

    // await Promise.all(
    //   customers.map(async (customer) => {
    //     customer.location = await DB.aggregation(
    //       "default",
    //       locationSchemaName,
    //       [
    //         {
    //           $match: { _id: customer.location },
    //         },
    //       ]
    //     );
    //     return customer;
    //   })
    // );

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
const getPreStagesCustomer = async (req, res, next) => {
  try {
    let pipeLine = [
      {
        $match: {
          prestages: "available"
        }
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locations",
        },
      },
    ];
    let customers = await DB.aggregation(
      req.auth.client_db,
      customerModel,
      pipeLine
    );
      console.log(customers);
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
    // if (req.body.category.length) req.body.category.map(cate => {
    //     if(typeof cate === String) return mongoose.Types.ObjectId(cate);
    // });
    console.log(req.body);
    req.body.location =
      typeof req.body.location === Array
        ? mongoose.Types.ObjectId(req.body.location)
        : req.body.location;
    req.body.location_name =
      typeof req.body.location_name === Array
        ? mongoose.Types.ObjectId(req.body.location_name)
        : req.body.location_name;
    req.body.is_active = true;
    req.body.created_at = IST();
    req.body.updated_at = IST();

    let customer = await DB.create(req.auth.client_db, customerModel, req.body);
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
    if (req.body.customer_name) data.customer_name = req.body.customer_name;
    if (req.body.contact_person) data.contact_person = req.body.contact_person;
    if (req.body.phone_no) data.phone_no = req.body.phone_no;
    if (req.body.email) data.email = req.body.email;
    if (req.body.address) data.address = req.body.address;
    if (req.body.location) data.location = req.body.location;
    if (req.body.location_name) data.location_name = req.body.location_name;
    if (req.body.prestages) data.prestages = req.body.prestages;
    if ("isActive" in req.body) data.is_active = req.body.isActive;

    req.body.updated_at = IST();
    console.log("dtmade", data);
    await DB.update(req.auth.client_db, customerModel, {
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
  getPreStagesCustomer
};
