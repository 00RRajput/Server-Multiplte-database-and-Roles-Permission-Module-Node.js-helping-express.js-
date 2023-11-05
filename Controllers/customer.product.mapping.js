const Response = require("../Helpers/response.helper");
const DB = require("../Helpers/crud.helper");
const { IST } = require("../Helpers/dateTime.helper");
const {
  customerModelName,
} = require("../Database/Models/customer.product.model");
const { customerModel } = require("../Database/Models/customer.model");
const { default: mongoose } = require("mongoose");
// const { clientModelName } = require("../Database/Models/client.model");

const createProductCustomer = async (req, res, next) => {
  try {
    let readingData = await DB.read(req.auth.client_db, customerModelName, {});
    console.log("before", readingData, req.body);
    // console.log(req.body);
    if (req.body.customer) {
      readingData = readingData.filter(
        (item) => item.customer_id.toHexString() === req.body.customer
      );
    }
    console.log("after", readingData);
    if (readingData.length) {
      let data = {};
      req.body.product.map((item) => {
        readingData[0].product.push(item);
      });
      data.product = readingData[0].product;
      DB.update(req.auth.client_db, customerModelName, {
        query: {
          _id: readingData[0].id,
        },
        data,
      });
      return Response.success(res, { data });
    } else {
      console.log(req.body);
      const data = {
        product: req.body.product,
        customer_name: req.body.customer_name,
        customer_id: req.body.customer,
        isActive: true,
        created_at: IST(),
        updated_at: IST(),
      };
      await DB.create(req.auth.client_db, customerModelName, data);
      return Response.success(res, { data });
    }
  } catch (error) {
    next(error);
  }
};

const readProductCustomer = async (req, res, next) => {
  try {
    const customerId = req.query.customerId;
    console.log(req.query);
    // let query = {};
    // query = { customer_id: req.query.customerId };
    let pipeLine = [
      // { $match: query },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customers",
        },
      },
      {
        $addFields: {
          product: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  { id: "$$product._id" },
                  { _id: undefined }, // Remove the original _id field
                ],
              },
            },
          },
          customer: {
            $map: {
              input: "$customers",
              as: "customer",
              in: {
                $mergeObjects: [
                  "$$customer",
                  { id: "$$customer._id" },
                  { _id: undefined }, // Remove the original _id field
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          product: 1,
          customer: 1,
        },
      },
    ];
    if (customerId) {
      console.log("customerId", mongoose.Types.ObjectId(customerId));
      pipeLine.unshift({
        $match: {
          customer_id: mongoose.Types.ObjectId(customerId), // Assuming you're using Mongoose
        },
      });
    }

    // Run the pipeline using db.collection.aggregate(pipeline)

    let data = await DB.aggregation(
      req.auth.client_db,
      customerModelName,
      pipeLine
    );
    console.log(data);
    data.filter((item, index) => {
      if (!item.product.length) {
        console.log("yes");
        DB.remove(req.auth.client_db, customerModelName, item);
      }
      //   return data;
    });
    console.log("customers", data);
    // const data = await DB.read(req.auth.client_db, customerModelName, query);

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductMap = async (req, res, next) => {
  try {
    let customer_id;
    console.log("paramsquery", req.params, req.body);
    let readingData = await DB.read(req.auth.client_db, customerModelName, {
      _id: req.body.id,
    });
    console.log("readingDta", readingData);
    readingData.map((item) => {
      item.product.map((item1, index) => {
        console.log(item1);
        if (req.params.id === item1.toHexString()) {
          console.log("in");
          customer_id = item.id;
          item.product.splice(index, 1);
        }
      });
    });
    console.log("readingDtaafter", readingData[0]);
    const data = readingData[0];
    await DB.update(req.auth.client_db, customerModelName, {
      query: { _id: customer_id },
      data,
    });
    return Response.success(res, { data });
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
const getCustomerProduct = async (req, res, next) => {
  try {
    let pipe = [
      {
        $match: { customer_id: mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "products",
        },
      },
    ];
    let data = await DB.aggregation(
      req.auth.client_db,
      customerModelName,
      pipe
    );
    console.log("data", data);
    data = data?.length ? data[0] : data;
    return Response.success(res, {
      data: { data },
      count: data?.length,
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
const getLocationCustomer = async (req, res, next) => {
  try {
    const locationId = req.params.id;
    const data = await DB.read(req.auth.client_db, customerModel, {
      location: locationId,
    });

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProductCustomer,
  readProductCustomer,
  updateProductMap,
  getCustomerProduct,
  getLocationCustomer,
};
