const DB = require('../Helpers/crud.helper');
const Response = require('../Helpers/response.helper');
const { IST } = require('../Helpers/dateTime.helper');
const mongoose = require('mongoose');
const { inboundModel } = require("../Database/Models/inbound.model");
const { preStagesModel } = require("../Database/Models/pre-stages.model");

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const index = async (req, res, next) => {
    try {
        let pipe = [
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customers',
                  },
            },
            {
                $unwind: '$customers'
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'locations',
                  },
            },
            {
                $unwind: '$locations'
            }
        ]

        let data = await DB.aggregation(req.auth.client_db, preStagesModel, pipe)
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
        req.body.isActive = true;
        if (!req.body.id) req.body.created_at = IST();
        req.body.updated_at = IST();
        
        if (req.body.id) DB.update(req.auth.client_db, preStagesModel, { query: {_id: req.body.id}, data: req.body });
        else await DB.create(req.auth.client_db, preStagesModel, req.body);
        
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
        console.log(mongoose.Types.ObjectId(req.params.id), req.body.isActive)
        req.body.updated_at = IST();
        
        await DB.update(
            req.auth.client_db,
            preStagesModel,
            {
                query: { _id: mongoose.Types.ObjectId(req.params.id) },
                data: {
                    isActive: req.body.isActive,
                    updated_at: req.body.updated_at
                }});
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
    destroy,
}