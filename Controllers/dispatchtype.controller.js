const { dispatchTypeModel } = require("../Database/Models/dispatchtype.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const { generateCustomError } = require("../Helpers/error.helper");

const createDispatchType = async (req, res, next) => {
  try {
    //? unique check
    await DB.isUnique(req.auth.client_db, dispatchTypeModel, {
      dispatch_type: req.body.dispatch_type,
    });

    const data = {
      dispatch_type: req.body.dispatch_type,
      isActive: true,
      created_at: DateTime.IST("database"),
      updated_at: DateTime.IST("database"),
    };

    //? creating data
    await DB.create(req.auth.client_db, dispatchTypeModel, data);
    return Response.success(res, { data });
  } catch (error) {
    next(error);
  }
};

const updateDispatchType = async (req, res, next) => {
  console.log(req.params, req.body);
  if (!req.params.id)
    await generateCustomError(
      "Invalid data !",
      "BAD_REQUEST",
      400,
      "clientError"
    );

  let data = await DB.update(req.auth.client_db, dispatchTypeModel, {
    query: {
      _id: req.params.id,
    },
    data: { ...req.body },
  });
  return Response.success(res, { data });
};

const readDispatchType = async (req, res, next) => {
  try {
    let query = {},
      data;

    if (req.query?.client) query.client = req.query?.client;

    data = await DB.read(req.auth.client_db, dispatchTypeModel, query);

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDispatchType,
  readDispatchType,
  updateDispatchType,
};
