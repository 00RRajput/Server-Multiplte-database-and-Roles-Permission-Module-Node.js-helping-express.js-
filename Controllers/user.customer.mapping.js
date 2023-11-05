const Response = require("../Helpers/response.helper");
const DB = require("../Helpers/crud.helper");
const { IST } = require("../Helpers/dateTime.helper");
const { userCustomerModel } = require("../Database/Models/user.customer.model");
// const { clientModelName } = require("../Database/Models/client.model");

const createUserCustomer = async (req, res, next) => {
  try {
    console.log("manifest", req.body);

    let readingData = await DB.read(req.auth.client_db, userCustomerModel, {});
    console.log("before", readingData);
    // console.log(req.body);
    if (req.body.user) {
      readingData = readingData.filter(
        (item) => item.user_id.toHexString() === req.body.user
      );
    }
    console.log("after", readingData);
    if (readingData.length) {
      let data = {};
      req.body.customer.map((item) => {
        readingData[0].customer.push(item);
      });
      data.customer = readingData[0].customer;
      DB.update(req.auth.client_db, userCustomerModel, {
        query: {
          _id: readingData[0].id,
        },
        data,
      });
      return Response.success(res, { data });
    } else {
      console.log(req.body);
      const data = {
        customer: req.body.customer,
        user_name: req.body.user_name,
        user_id: req.body.user,
        isActive: true,
        created_at: IST(),
        updated_at: IST(),
      };
      await DB.create(req.auth.client_db, userCustomerModel, data);
      return Response.success(res, { data });
    }
  } catch (error) {
    next(error);
  }
};

const readUserCustomer = async (req, res, next) => {
  try {
    let query = {};
    let pipeLine = [
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customers",
        },
      },
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "user",
              in: {
                $mergeObjects: [
                  "$$user",
                  { id: "$$user._id" },
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
          user: 1,
          customer: 1,
        },
      },
    ];

    // Run the pipeline using db.collection.aggregate(pipeline)

    let data = await DB.aggregation(
      req.auth.client_db,
      userCustomerModel,
      pipeLine
    );
    console.log(data);
    data.filter((item, index) => {
      if (!item.customer.length) {
        console.log("yes");
        DB.remove(req.auth.client_db, userCustomerModel, item);
      }
      //   return data;
    });
    // const data = await DB.read(req.auth.client_db, userCustomerModel, query);

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserMap = async (req, res, next) => {
  try {
    let customer_id;
    console.log("paramsquery", req.params, req.body);
    let readingData = await DB.read(req.auth.client_db, userCustomerModel, {
      _id: req.body.id,
    });
    console.log("readingDta", readingData);
    readingData.map((item) => {
      item.customer.map((item1, index) => {
        if (req.params.id === item1.toHexString()) {
          customer_id = item.id;
          item.customer.splice(index, 1);
        }
      });
    });
    console.log("readingDtaafter", readingData[0]);
    const data = readingData[0];
    await DB.update(req.auth.client_db, userCustomerModel, {
      query: { _id: customer_id },
      data,
    });
    return Response.success(res, { data });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createUserCustomer,
  readUserCustomer,
  updateUserMap,
};
