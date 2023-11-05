const DB = require('../Helpers/crud.helper');
const Response = require('../Helpers/response.helper');
const { IST } = require('../Helpers/dateTime.helper');
const mongoose = require('mongoose');
const { inboundModel } = require("../Database/Models/inbound.model");
const { uploadFile, getTempUrl } = require('../Helpers/aws.helper');

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
                    as: 'customer',
                  },
            },
            {
                $unwind: "$customer"
            },
            {
                $unwind: "$product_qty"
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_qty.product',
                    foreignField: '_id',
                    as: 'products',
                  },
            },
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: "$_id",
                    appointment_no: { $first: '$appointment_no' },
                    invoice_no: { $first: '$invoice_no' },
                    customer: { $first: '$customer' },
                    document_no: {$first: '$document_no'},
                    document: {$first: '$document'},
                    product_qty: {
                        $push: {
                          id: "$product_qty.id",
                          product: "$product_qty.product",
                          qty: "$product_qty.qty",
                          productInfo: "$products"
                        }
                    },
                    total_qty: { $first: '$total_qty' },
                    document_type: { $first: '$document_type' },
                    dispatch: {$first: '$dispatch'},
                    isActive: { $first: '$isActive' },
                }
            },
            {
                $project: {
                    _id: 1,
                    appointment_no: 1,
                    invoice_no: 1,
                    customer: {
                        id: "$customer._id",
                        customer_name: "$customer.customer_name",
                        email: "$customer.email",
                        address: "$customer.address",
                        phone_no: "$customer.phone_no",
                    },
                    document_no: 1,
                    document: 1,
                    product: {
                        $map: {
                            input: '$product_qty',
                            as: 'product',
                            in: {
                                $mergeObjects: [
                                    {
                                        id: '$$product.id',
                                        product_id: '$$product.product',
                                        qty: '$$product.qty',
                                        productInfo: {
                                            id: '$$product.productInfo._id',
                                            product_name: '$$product.productInfo.product_name'
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    total_qty: 1,
                    document_type: 1,
                    dispatch: {
                        id: "$dispatch._id",
                        dispatch_type: "$dispatch.dispatch_type"
                    },
                    creation_date: 1,
                    expected_time: 1,
                    isActive: 1,
                }
            }
        ]

        let data = await DB.aggregation(req.auth.client_db, inboundModel, pipe);
        
        data = await Promise.all(data.map(async (item) => {
            item.document = await getTempUrl(item.document);
            return item;
        }));
        return Response.success(res, {
            data: { data },
            count: data.length
        });
    } catch (error) {
        next(error);
    }
}

const modifyRequestBody = async ($body, $file) => {
    if (typeof $body.customer_id === String) $body.customer_id = mongoose.Types.ObjectId($body.customer_id)
    if ($file) $body.document = await uploadFile($file, 'document');
    else $body.document = $body.document_img;
    $body.document_type = typeof $body.locdocument_typeation === String ? mongoose.Types.ObjectId($body.document_type) : $body.document_type;
    $body.product_qty = $body.product_qty.map(product => {
        if (typeof product.product === String || typeof product.product === "string") product.product = mongoose.Types.ObjectId(product.product);
        return product
    });
    $body.updated_at = IST();
    delete $body.document_img;
    return $body
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
        req.body.appointment_no = await DB.getDataCountSequence(req.auth.client_db, inboundModel);
        req.body.isActive = true;
        req.body.created_at = IST();
        
        let requsetData = await modifyRequestBody(req.body, req.file);
        
        await DB.create(req.auth.client_db, inboundModel, requsetData);
        
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
        let requsetData = await modifyRequestBody(req.body, req.file);
        await DB.update(req.auth.client_db, inboundModel, { query: mongoose.Types.ObjectId(req.params.id), data: requsetData });
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


