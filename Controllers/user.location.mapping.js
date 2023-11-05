const Response = require("../Helpers/response.helper");
const DB = require("../Helpers/crud.helper");
const { IST } = require("../Helpers/dateTime.helper");
const mongoose = require('mongoose');
const { userLocationModel } = require("../Database/Models/user.location.model");
const {locationSchemaName} = require("../Database/Models/location.model");
// const { clientModelName } = require("../Database/Models/client.model");


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

    let pipe = [
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'location_id',
          foreignField: '_id',
          as: 'locations'
        }
      }
    ];
    let data = await DB.aggregation(req.auth.client_db, userLocationModel, pipe);
    console.log('data', data);
   
    data.map(async (item) => {
      item.locations = item.locations[0];
      item.user = item.user[0];
      return item;
    });

    return Response.success(res, {
        data: { data },
        count: data.length
    });
  } catch (error) {
      next(error);
  }
}

/**
*
* @param {express request instance} req
* @param {express response instance} res
* @param {to access next middleware} next
* @returns { Response instance with user data / error }
*/
const store = async (req, res, next) => {
  try {
    let query = {};
      if (req.body.id != '' && typeof req.body.location_id === String) req.body.id = mongoose.Types.ObjectId(req.body.id);
      if (typeof req.body.location_id === String) req.body.location_id = mongoose.Types.ObjectId(req.body.location_id);
      req.body.user_id = typeof req.body.user_id === String ? mongoose.Types.ObjectId(req.body.user_id) : req.body.user_id;
      req.body.isActive = true;
      req.body.created_at = IST();
      req.body.updated_at = IST();
     
      let existMapping = await DB.read(req.auth.client_db, userLocationModel, {
        user_id: req.body.user_id,
        location_id: req.body.location_id
      });
      
      if(existMapping.length) return Response.badRequest(res, { message: 'Mapping already exists!'});;
     
      if (req.body.id == '') await DB.create(req.auth.client_db, userLocationModel, req.body);
      else await DB.update(req.auth.client_db, userLocationModel, {
        query: { _id: req.body.id },
        data: req.body
      })

      return Response.success(res, {});
  } catch (error) {
      next(error);
  }
}

/**
*
* @param {express request instance} req
* @param {express response instance} res
* @param {to access next middleware} next
* @returns { Response instance with user data / error }
*/
const update = async (req, res, next) => {
  try {
      let status = req.body.status ? false : true;
      if(req.body.del) await DB.remove(req.auth.client_db, userLocationModel, { _id: req.params.id })
      else await DB.update(req.auth.client_db, userLocationModel, {
        query: { _id: req.params.id },
        data: { isActive : status}
      })
      return Response.success(res, {});
  } catch (error) {
      next(error);
  }
}

/**
*
* @param {express request instance} req
* @param {express response instance} res
* @param {to access next middleware} next
* @returns { Response instance with user data / error }
*/
const destroy = async (req, res, next) =>  {
  try {
      //
  } catch (error) {
      next(error);
  }
}


module.exports={
  index,
  store,
  update,
  destroy
}