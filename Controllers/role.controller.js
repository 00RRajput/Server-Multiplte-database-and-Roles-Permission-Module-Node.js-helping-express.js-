const Role = require("../Database/Models/role.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const { generateCustomError } = require("../Helpers/error.helper");
const { checkRoles } = require("../Helpers/helper");
const { readClientDB } = require("../Helpers/dbSelection.helper");
const { default: mongoose } = require("mongoose");

const createRole = async (req, res, next) => {
  try {
    let read_DB = "default";
    if (req.query?.client_id) {
      read_DB = await readClientDB({ client_id: req.query.client_id });
    } else read_DB = req.auth.client_db || read_DB;
    //? unique check
    await DB.isUnique(read_DB, Role.roleModelName, {
      role: req.body.role,
      department_id: mongoose.Types.ObjectId(req.body?.department),
    });
    let all = await DB.read(read_DB, Role.roleModelName, {});
    const data = {
      role: req.body.role,
      department_id: req.body.department,
      priority: all[all.length - 1].priority + 1,
      isActive: true,
      created_at: DateTime.IST(),
      updated_at: DateTime.IST(),
    };

    //? creating data
    await DB.create(read_DB, Role.roleModelName, data);
    return Response.success(res, { data });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  if (!req.params.id)
    await generateCustomError(
      "Invalid data !",
      "BAD_REQUEST",
      400,
      "clientError"
    );

  // let client_db = await DB.read("default", "ClientDatabase", {
  //   client_id: req.body.auth.user_id,
  // });

  // if (!client_db.length)
  //   await generateCustomError(
  //     "unable to find db",
  //     "system",
  //     500,
  //     "systemError"
  //   );

  //? unique check
  await DB.isUnique(req.auth?.client_db, Role.roleModelName, {
    role: req.body.role,
    department_id: mongoose.Types.ObjectId(req.body?.department),
  });
  req.body.role = req.body.role;
  req.body.department_id = req.body.department;
  req.body.updated_at = DateTime.IST();
  let data = await DB.update(req.auth?.client_db, Role.roleModelName, {
    query: { _id: req.params.id },
    data: { ...req.body },
  });
  return Response.success(res, { data });
};

const readRoles = async (req, res, next) => {
  try {
    let query = {},
      roles;
    const acceptedRoles = ["ADMIN", "SUPER_ADMIN"];

    if (req.auth?.role?.role && checkRoles(req.auth.role.role, ["DEVELOPER"]))
      query = {};

    let read_DB = "default";
    if (req.query?.client) {
      read_DB = await readClientDB({ client_id: req.query.client });
    } else read_DB = req.auth.client_db || read_DB;

    let pipeLine = [
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department",
        },
      },
    ];
    roles = await DB.aggregation(read_DB, Role.roleModelName, pipeLine);

    return Response.success(res, {
      data: { roles },
      count: roles.length,
    });
  } catch (error) {
    next(error);
  }
};

const readRolesById = async (req, res, next) => {
  try {
    let read_DB = "default";
    if (req.query?.client) {
      let client_db = await DB.read("default", "ClientDatabase", {
        client_id: req.body.auth.user_id,
      });
      if (!client_db.length)
        await generateCustomError(
          "unable to find db",
          "system",
          500,
          "systemError"
        );
      read_DB = client_db[0].client_code;
    }
    let roles = await DB.readOne(read_DB, Role.roleModelName, {
      _id: req.params.id,
    });
    return Response.success(res, {
      data: { ...roles },
      count: roles.length,
    });
  } catch (error) {
    next(error);
  }
};

const removeRole = async (req, res, next) => {
  try {
    if (!req.params.id) {
      let err = new Error("Invalid data !");
      err.name = "bad_request";
      throw err;
    }
    let read_DB = "default";
    if (req.query?.client) {
      let client_db = await DB.read("default", "ClientDatabase", {
        client_id: req.body.auth.user_id,
      });
      if (!client_db.length)
        await generateCustomError(
          "unable to find db",
          "system",
          500,
          "systemError"
        );
      read_DB = client_db[0].client_code;
    }
    await DB.remove(read_DB, Role.roleModelName, { _id: req.params.id });
    return Response.success(res, {
      data: [],
      message: "role removed !",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  readRoles,
  readRolesById,
  updateRole,
  removeRole,
};
