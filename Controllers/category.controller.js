const { categoryModel } = require("../Database/Models/category.model");
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
    let categories = await DB.read(req.auth.client_db, categoryModel, {});
    return Response.success(res, {
      data: { categories },
      // count: data.length,
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
    await DB.isUnique(
      req.auth.client_db,
      categoryModel,
      { category: req.body.category },
      `category ${req.body.category}`
    );

    req.body.status = true;
    req.body.craeted_at = IST();
    req.body.updated_at = IST();
    let response = await DB.create(req.auth.client_db, categoryModel, req.body);
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
const update = async (req, res, next) => {
  try {
    await DB.isUnique(
      req.auth.client_db,
      categoryModel,
      { category: req.body.category },
      `category ${req.body.category}`
    );

    req.body.updated_at = IST();
    await DB.update(req.auth.client_db, categoryModel, {
      query: { _id: req.params.id },
      data: req.body,
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
