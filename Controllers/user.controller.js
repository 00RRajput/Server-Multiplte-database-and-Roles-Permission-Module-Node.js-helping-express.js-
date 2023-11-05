const User = require('../Database/Models/user.model');
const Role = require('../Database/Models/role.model');
const DB = require('../Helpers/crud.helper');
const Response = require('../Helpers/response.helper');
const { generateCustomError } = require("../Helpers/error.helper");
const AuthHelper = require('../Helpers/auth.helper');
const { lookup } = require('../Helpers/request.helper');
const { getRole } = require('../Helpers/helper');
const UserConfig = require('../Database/Models/user_config.model');
const { IST } = require('../Helpers/dateTime.helper');

async function getUsers(req, res, next) {
    try {
        let query = {};
        let pagination = {};
        let sort = {};
        if (req?.query?.get && req?.query?.get === 'all')
            query = {};
        
        if (req?.query?.get && req?.query?.get === 'deleted')
            query = { is_deleted: true };

        if (req?.query?.get && req?.query?.get === 'active')
            query = { is_deleted: false };
        
        // if (req?.query?.client)
        //     query.client = req?.query?.client;

        if (req?.query?.name)
            query.name = { $regex: new RegExp(`.*${req?.query?.name}.*`, 'i') }

        
        if (req?.query?.email)
            query.email = { $regex: new RegExp(`.*${req?.query?.email}.*`, 'i') } ;

        if (req?.query?.phone)
            query.phone = req?.query?.phone;

        if (req?.query?.start_date)
            query.created_at = { $gte: new Date(req?.query.start_date) };
        
        if (req?.query?.end_date)
            query.created_at = { $lte: new Date(req?.query.end_date) };
        
        if (req?.query?.start_date && req?.query?.end_date)
            query.created_at = { $and: [{ $gte: new Date(req?.query.start_date) }, { $lte: new Date(req?.query.end_date) }] };
        
        if (req?.query?.offset)
            pagination.limit = parseInt(req?.query?.offset, 10);
        
        if (req?.query?.page)
            pagination.skip = ((parseInt(req?.query?.page, 10))) * parseInt(req?.query?.offset, 10) || 0;
        
        if (req?.query?.role_id) 
            query.role = req?.query?.role_id;
        
        if (req?.query?.order_by)
            sort[req?.query?.order_by || '_id'] = req?.query?.sort === 'asc' ? 1 : -1;
        else sort = { _id: req?.query?.sort === 'asc' ? 1 : -1 };

        // let count = await DB.getCount(User, query);

        // if(req.auth.role.role.includes('SUPER-ADMIN')) query.user_name = 'Admin';
        console.log('auth client -- users controller ', req.auth.client_db);

        let data = [];
        if (req.auth.client_db === 'default') {
            const client_db = await DB.read("default", "ClientDatabase", {});
            if (client_db.length) {
                for (let i = 0; i < client_db.length; i++) {
                    client_db[i];
                    // const users = await DB.population(
                    //     client_db[i].client_code,
                    //     "User",
                    //     {
                    //         queryString: query,
                    //         queryExclude: { __v: 0 },
                    //         popString: "role",
                    //         popExclude: {
                    //             _id: 1,
                    //             name: 1,
                    //             first_name: 1,
                    //             last_name: 1,
                    //         },
                    //     },
                    // );
                    const users = await DB.aggregation(
                        client_db[i].client_code,
                        "User",
                        [
                            {
                                $lookup: {
                                    from: 'roles',
                                    localField: 'role',
                                    foreignField: '_id',
                                    as: 'roles',
                                }
                            }
                        ],
                    );
                    data = [...data, ...users];
                }
                
                let roleArray = [];
                data = data.filter(data => {
                    if(data.roles.length) roleArray = data.roles.map((role) => role.role)
                    if(roleArray.includes('ADMIN')) return data;
                    return undefined;
                })
            } 
        } else {
            const users = await DB.population(
                req.auth.client_db,
                "User",
                {
                    queryString: query,
                    queryExclude: { __v: 0 },
                    popString: "role",
                    popExclude: {
                        created_at: 0,
                        updated_at: 0,
                        __v: 0
                    },
                },
            );
            data = [...users];
        }
       
        Response.success(res, {
            count: data.length,
            data: {
                data
            }
        });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        if (!req.params.id)
            await generateCustomError("Invalid data !", "BAD_REQUEST", 400, "clientError");

        if (req.body?.password) {
            req.body.password = await AuthHelper.generateHash(req.body.password);
        } else if (req.body?.password == '' || req.body?.password == null)
            delete req.body?.password;
       
        if (req.body?.roles && typeof req.body?.roles === 'string')
            req.body.role = [req.body.roles];
        else if (req.body?.roles && req.body?.roles.length) 
            req.body.role = req.body?.roles.map(role => {
                if (typeof role === 'object') return role.id;
                else return role;
            })
         
        if(req.query?.client) req.body.client = req.query?.client;
        let client_db = await DB.read("default", "ClientDatabase", {
            client_id: req.body.client,
        });

        if (!client_db.length) await generateCustomError(
                "unable to find db",
                "system",
                500,
                "systemError",
            );
        let data = await DB.update(client_db[0].client_code, "User", { query: { _id: req.params.id }, data: { ...req.body } });


        Response.success(res, {
            data: {
                data
            },
            message: 'user updated successfully !'
        });
    } catch (error) {
        next(error);
    }
}


const holibookUser = async (req, res, next) => {
    try {
        const data = await lookup({
            host: `holibook.holisollogistics.com`,
            endpoint: '/api/userslist',
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.HOLIBOOK_USERNAME}:${process.env.HOLIBOOK_PASSWORD}`).toString('base64')
            }
        });

        Response.success(res, {
            data: data.data,
            count: data.data.length,
            message: 'data sent !'
        });
    } catch (error) {
        next(error);
    }
}

const getUserFields = async (req, res, next) => {
    try {
        let fields = await UserConfig.find({ client_id: req.params.client });
        let newfield = fields.map(field => {
           return Object.keys(field).map(key => {
                {key: field[key]};
            })
        })
        // console.log(newfield);
    } catch (error) {
        next(error);
    }
}
module.exports={
    getUsers,
    update,
    holibookUser,
    getUserFields
}