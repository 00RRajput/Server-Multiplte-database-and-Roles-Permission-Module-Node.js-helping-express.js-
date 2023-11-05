const { yardModelName } = require('../Database/Models/yard.model');
const {yardSectionModelName} = require('../Database/Models/yard_section.model');
const DB = require('../Helpers/crud.helper');
const Response = require('../Helpers/response.helper');
const { IST } = require('../Helpers/dateTime.helper');
const mongoose = require('mongoose');
const { checkLimition } = require("../Helpers/helper");
const {locationSchemaName} = require("../Database/Models/location.model");

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
                  from: 'locations',
                  localField: 'location',
                  foreignField: '_id',
                  as: 'location',
                },
            },
            {
                $unwind: '$location'
            },
            {
                $lookup: {
                  from: 'customers',
                  localField: 'customer',
                  foreignField: '_id',
                  as: 'customer',
                },
            },
            {
                $unwind: '$customer'
            },

            {
                $lookup: {
                  from: 'yardsections',
                  localField: '_id',
                  foreignField: 'yard_id',
                  as: 'yardsection',
                },
            },
            {
                $unwind: '$yardsection'
            },
            {
                $lookup: {
                  from: 'products', 
                  localField: 'yardsection.product',
                  foreignField: '_id',
                  as: 'yardsection.products'
                }
            },
            {
                $unwind: '$yardsection.products'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'yardsection.products.product_type',
                    foreignField: '_id',
                    as: 'yardsection.products.type'
                }
            },
            {
                $unwind: '$yardsection.products.type'
            },
            {
                $group: {
                    _id: '$_id',
                    location: { $first: '$location' },
                    customer: { $first: '$customer' },
                    isActive: { $first: '$isActive' },
                    yardsection: { $push: '$yardsection' }
                }
            },
            {
                $project: {
                    _id: 1,
                    location: {
                        address: '$location.address',
                        city: '$location.city_name',
                        state: '$location.state_name',
                        country: '$location.country_name',
                        pincode: '$location.pin',
                    },
                    customer: {
                        _id: '$customer._id',
                        customer_name: '$customer.customer_name',
                    },
                    yardsection: {
                        $map: {
                            input: '$yardsection',
                            as: 'section',
                            in: {
                                $mergeObjects: [
                                    // '$$section',
                                    {
                                        section_id: '$$section._id',
                                        section_name: '$$section.name',
                                        capacity: '$$section.capacity',
                                        product_name: '$$section.products.product_name',
                                        product_type: '$$section.products.type.category',
                                        product_desc: '$$section.products.product_desc'
                                    }
                                ]
                            }
                        }
                    },
                    isActive: 1
                }
            }
        ];
        let yards = await DB.aggregation(req.auth.client_db, yardModelName, pipe);
        
        return Response.success(res, {
            data: { yards },
            count: yards.length
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
        if (typeof req.body.customer === String) req.body.customer = mongoose.Types.ObjectId(req.body.customer)
        req.body.location = typeof req.body.location === String ? mongoose.Types.ObjectId(req.body.location) : req.body.location;
        req.body.isActive = true;
        req.body.created_at = IST();
        req.body.updated_at = IST();

        const limit = await checkLimition(req, res, next, 'yard_limit', req.body.isActive);
        if(!limit) return Response.badRequest(res, { message: 'You have no limit'});

        let yard = await DB.create(req.auth.client_db, yardModelName, req.body);
       
        await storeYardSections(req, res, next, yard.id );

        return Response.success(res, {});
    } catch (error) {
        next(error);
    }
}

/**
 *
 * @param {Array} data
 * @param {ObjectId} yard_id
 * @returns {}
 */
const storeYardSections = async (req, res, next, yard_id) =>  {
    try {
        req.body.sections.map( async(section) => {
            await DB.create(req.auth.client_db, yardSectionModelName, {
                yard_id: yard_id,
                id: section.id,
                name: section.name,
                capacity: section.capacity,
                product: section.product,
                isActive: section.isActive ?? true,
                created_at: IST(),
                updated_at: IST()
            });
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
const update = async (req, res, next) => {
    try {
        req.body.updated_at = IST();
        
        const limit = await checkLimition(req, res, next, 'yard_limit', req.body?.isActive);
        if(req.body?.isActive && !limit) return Response.success(res, { message: 'You have no limit'});

        await DB.update(req.auth.client_db, yardModelName, { query: { _id: req.params.id }, data: { ...req.body } });
        
        await DB.removeMany(req.auth.client_db, yardSectionModelName, {yard_id: req.params.id});
        
        if(req.body?.sections.length) await storeYardSections(req, res, next, req.params.id);
        
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
        await DB.removeMany(req.auth.client_db, yardSectionModelName, {yard_id: req.params.id});
        await DB.remove(req.auth.client_db, yardModelName, {_id: req.params.id});
        return Response.success(res, {});
    } catch (error) {
        next(error);
    }
}

const getSelectedYard = async (req, res, next) =>  {
    try {
        const pipeline = [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: 'yardsections',
                    localField: '_id',
                    foreignField: 'yard_id',
                    as: 'yardsection'
                }
            },
            {
                $limit: 1
            }
        ]

        let yard = await DB.aggregation(req.auth.client_db, yardModelName, pipeline);
        yard = yard[0]
        return Response.success(res, {
            data: { yard },
            count: yard.length
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
const changeYardStatus = async (req, res, next) =>  {
    try {
        let status = '';
        let data = await DB.readOne(req.auth.client_db, yardModelName, { _id: req.params.id});
        if (data && data.isActive) status = false;
        else if (data && !data.isActive) status = true;

        const limit = await checkLimition(req, res, next, 'yard_limit', status);
        if(req.body?.isActive && !limit) return Response.success(res, { message: 'You have no limit'});

        await DB.update(req.auth.client_db, yardModelName, { query: { _id: req.params.id }, data: { isActive: status } });
        return Response.success(res, {});;
    } catch (error) {
        next(error);
    }
}

module.exports={
    index,
    store,
    update,
    destroy,
    getSelectedYard,
    changeYardStatus
}