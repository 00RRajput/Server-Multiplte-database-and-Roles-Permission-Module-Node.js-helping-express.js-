const Department = require("../Database/Models/department.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const { generateCustomError } = require("../Helpers/error.helper");

const createDepartment = async (req, res, next) => {
  try {
    //? unique check
    await DB.isUnique(req.auth.client_db, Department.departmentModelName, {
      department: req.body.department,
    });

    const data = {
      department: req.body.department,
      isActive: true,
      created_at: DateTime.IST("database"),
      updated_at: DateTime.IST("database"),
    };

    //? creating data
    await DB.create(req.auth.client_db, Department.departmentModelName, data);
    return Response.success(res, { data });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  if (!req.params.id)
    await generateCustomError(
      "Invalid data !",
      "BAD_REQUEST",
      400,
      "clientError"
    );

  let data = await DB.update(
    req.auth.client_db,
    Department.departmentModelName,
    {
      query: {
        _id: req.params.id,
      },
      data: { ...req.body },
    }
  );
  return Response.success(res, { data });
};

const readDepartment = async (req, res, next) => {
  try {
    let query = {},
      data;

    if (req.query?.client) query.client = req.query?.client;

    data = await DB.read(
      req.auth.client_db,
      Department.departmentModelName,
      query
    );

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  readDepartment,
  updateDepartment,
};
