const { productSchemaModelName } = require("../Database/Models/product.model");
const Response = require("../Helpers/response.helper");
const DB = require("../Helpers/crud.helper");
const { IST } = require("../Helpers/dateTime.helper");
// const { clientModelName } = require("../Database/Models/client.model");

const createProduct = async (req, res, next) => {
  try {
    //? unique check
    // await DB.isUnique(
    //   req.auth.client_db,
    //   productSchemaModelName,
    //   { product_name: req.body.product_name },
    //   "Product"
    // );

    const data = {
      product_name: req.body.product_name,
      product_desc: req.body.product_desc,
      isActive: true,
      product_type: req.body.product_type,
      product_type_name: req.body.product_type_name,
      created_at: IST(),
      updated_at: IST(),
    };

    //? creating data
    await DB.create(req.auth.client_db, productSchemaModelName, data);
    return Response.success(res, { data });
  } catch (error) {
    next(error);
  }
};

const readProducts = async (req, res, next) => {
  try {
    let query = {};
    let pipeLine = [
      {
        $lookup: {
          from: "categories",
          localField: "product_type",
          foreignField: "_id",
          as: "category",
        },
      },
    ];
    let data = await DB.aggregation(
      req.auth.client_db,
      productSchemaModelName,
      pipeLine
    );
    console.log("data", data);
    // const data = await DB.read(
    //   req.auth.client_db,
    //   productSchemaModelName,
    //   query
    // );

    return Response.success(res, {
      data: { data },
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateProducts = async (req, res, next) => {
  try {
    let data = {};
    if (req.body.product_name) data.product_name = req.body.product_name;
    if (req.body.product_desc) data.product_desc = req.body.product_desc;
    if (req.body.product_type) data.product_type = req.body.product_type;
    if (req.body.product_type_name)
      data.product_type_name = req.body.product_type_name;
    if ("isActive" in req.body) data.isActive = req.body.isActive;
    await DB.update(req.auth.client_db, productSchemaModelName, {
      query: { _id: req.params.id },
      data,
    });
    return Response.success(res, {
      data: { updated: true },
      message: "Client updated !",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProduct,
  readProducts,
  updateProducts,
};
