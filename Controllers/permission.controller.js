const Permissions = require("../Database/Models/permissions.model");
const { rolePermissionsSchema, rolePermissionsModelName } = require("../Database/Models/role_permissions.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const { generateCustomError } = require("../Helpers/error.helper");
const mongoose = require('mongoose');
const { readClientDB } = require("../Helpers/dbSelection.helper");


const RolePermissions = mongoose.model("RolePermissions", rolePermissionsSchema);

const store = async (req, res, next) => {
    try {
        let read_db = "default";
        if (req.query.client_id) {
            read_db = await readClientDB({ client_id: req.query.client_id });
            await DB.removeMany(read_db, Permissions.permissionsModelName, {});
        } else read_db = req.auth.client_db || read_db;
        
        let roles;
        roles = await DB.read(read_db, rolePermissionsModelName, {role_id: req.body.role_id});
        
        if (roles.length) {
            await DB.removeMany(read_db, rolePermissionsModelName, {
                role_id: req.body.role_id,
            });
        }

        let keys = Object.keys(req.body.permission).map(key => key);
        keys.forEach( async (key, ind) => {
            // let hasPermission = await Permissions.find({ title: key });
            let hasPermission = await DB.read(
                req.query.client_id ? 'default' : read_db,
                Permissions.permissionsModelName,
                {
                    title: key,
                },
            );
            if (
                req.query.client_id &&
                hasPermission[0] &&
                req.body.permission[key]
            ) {
                delete hasPermission[0].id;
                await DB.create(read_db, Permissions.permissionsModelName, {
                    ...hasPermission[0],
                    created_at: DateTime.IST(),
                    updated_at: DateTime.IST(),
                });
            }
            
            if (hasPermission.length) {
                await DB.create(read_db, rolePermissionsModelName, {
                    permission: key,
                    parent: hasPermission[0].parent,
                    client: req.body.client,
                    role_id: req.body.role_id,
                    status: req.body.permission[key],
                    created_at: DateTime.IST("database"),
                    updated_at: DateTime.IST("database"),
                });
                // RolePermissions.create({
                //     permission: key,
                //     parent: hasPermission[0].parent,
                //     client: req.body.client,
                //     role_id: req.body.role_id,
                //     status: req.body.permission[key],
                //     created_at: DateTime.IST("database"),
                //     updated_at: DateTime.IST("database")
                // })
            }
        })
        return Response.success(res, {});
    } catch (error) {
        next(error)
    }
};


const readPermission = async (req, res, next) => {
    try {
        // let read_db = req.auth.client_db;
        // if (req.query.client_id) {
        //     read_db = await readClientDB({ client_id: req.query.client_id });
        // } else read_db = req.auth.client_db || read_db;
        
        let query = {}, data;
        console.log("DB -- ", req.auth.client_db);
        data = await DB.aggregation(
            req.auth.client_db,
            Permissions.permissionsModelName,
            [
                {
                    $group: {
                        _id: "$parent", // Group by the "parent" field
                        count: { $sum: 1 }, // Count the number of documents in each group
                        childData: {
                            $push: {
                                // Include child data in each group
                                permission: "$permission",
                                title: "$title",
                                display_name: "$display_name",
                                parent: "$parent",
                                parent_name: "$parent_name",
                            },
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1, // Sort by the "_id" field in ascending order (1) or descending order (-1)
                        // Add more sorting criteria as needed
                    },
                },
            ],
        );
        // data = await Permissions.aggregate([
        //     {
        //         $group: {
        //             _id: '$parent', // Group by the "parent" field
        //             count: { $sum: 1 }, // Count the number of documents in each group
        //             childData: { $push: { // Include child data in each group
        //                 permission :'$permission',
        //                 title :'$title',
        //                 display_name:'$display_name',
        //                 parent:'$parent',
        //                 parent_name:'$parent_name'
        //             }}
        //         }
        //     },
        //     {
        //         $sort: {
        //           _id: 1, // Sort by the "_id" field in ascending order (1) or descending order (-1)
        //           // Add more sorting criteria as needed
        //         },
        //     }
        // ]);
        
        data = removeKeys(["_id"], data)
        
        return Response.success(res, {
            data: { data },
            count: data.length
        });
        
    } catch (error) {
        next(error);
    }
}

const readRolePermission = async (req, res, next) => {
    try {
        let read_db = "default";
        if (req.query.client_id) {
            read_db = await readClientDB({ client_id: req.query.client_id });
        } else read_db = req.auth.client_db || read_db;
        let data;
        data = await DB.aggregation(read_db, rolePermissionsModelName, [
            {
                $match: {
                    role_id: mongoose.Types.ObjectId(req.query.role_id),
                }, // Apply filters based on req.query
            },
            {
                $group: {
                    _id: "$parent", // Group by the "parent" field
                    count: { $sum: 1 }, // Count the number of documents in each group
                    childData: {
                        $push: {
                            // Include child data in each group
                            title: "$permission",
                            status: "$status",
                            parent: "$parent",
                        },
                    },
                },
            },
            {
                $sort: {
                    _id: 1, // Sort by the "_id" field in ascending order (1) or descending order (-1)
                    // Add more sorting criteria as needed
                },
            },
        ]);
        // data = await RolePermissions.aggregate([
        //     {
        //         $match: {
        //             role_id: mongoose.Types.ObjectId(req.query.role_id)
        //         }, // Apply filters based on req.query
        //     },
        //     {
        //         $group: {
        //             _id: '$parent', // Group by the "parent" field
        //             count: { $sum: 1 }, // Count the number of documents in each group
        //             childData: { $push: { // Include child data in each group
        //                 title :'$permission',
        //                 status :'$status',
        //                 parent:'$parent'
        //             }}
        //         }
        //     },
        //     {
        //         $sort: {
        //           _id: 1, // Sort by the "_id" field in ascending order (1) or descending order (-1)
        //           // Add more sorting criteria as needed
        //         },
        //     }
        // ]);
        // console.log('data',data);
        data = removeKeys(["_id"], data)

        Response.success(res, {
            data: { data },
            count: data?.length
        });
    } catch (error) {
        next(error);
    }
}

const getPermission = async (req, res, next) => {
    try {
        let query, roles, permissions;
        if (req.query.roles !== 'undefined')
            roles = JSON.parse(req.query.roles);
        else await generateCustomError('Invalid data !', 'bad_request', 400, 'clientError');
        roles = roles.map(role => mongoose.Types.ObjectId(role));
        
        let read_db = "default";
        if (req.query.client_id) {
            read_db = await readClientDB({ client_id: req.query.client_id });
        } else read_db = req.auth.client_db || read_db;


        permissions = await DB.read(read_db, rolePermissionsModelName, {
            role_id: roles,
        });
        
        permissions = permissions.map(permission => permission.status ? permission.permission : undefined)
        .filter((permission) => permission !== undefined);
        Response.success(res, {
            data: { permissions },
            count: permissions?.length
        });
    } catch (error) {
        next(error);
    }
}

function removeKeys(keys, data, children = []) {
    if (data instanceof Array) {
        return data.map(item => removeKeys(keys, item, children));
    }
    try {
        const { _id, ...rest } = data;
        const newData = { id: _id, ...rest };

        for (const key of keys) {
            delete newData[key];
        }

        for (const childKey of children) {
            if (childKey in newData) {
                newData[childKey] = removeKeys(keys, newData[childKey]);
            }
        }
        return newData;
    } catch (error) {
        console.log(error);
        return {};
    }
}

module.exports = {
    store,
    readPermission,
    readRolePermission,
    getPermission
}

