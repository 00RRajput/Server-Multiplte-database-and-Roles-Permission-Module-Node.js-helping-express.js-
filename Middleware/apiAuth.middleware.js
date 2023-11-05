const Response = require("../Helpers/response.helper");
const { verifyToken, extractToken } = require("../Helpers/auth.helper");
const DB = require("../Helpers/crud.helper");
const { getRole } = require("../Helpers/helper");

const Role = require("../Database/Models/role.model");
const User = require("../Database/Models/user.model");

const { generateCustomError } = require("../Helpers/error.helper");

function authorize(authRoles) {
    return async (req, res, next) => {  
        // getting user role details from DB
        const roles = await DB.read(
            req.auth.client_db,
            Role.roleModelName,
            {
                _id: (req.auth.role.id),
                isActive: true
            }
        );
        console.log('roles', req.auth)
        if (roles.length && authRoles.length && authRoles.includes(roles[0].role)) {
            req.auth.role.name = roles[0].role;
            return next();
        }
        res.set('x-server-errortype', 'AccessDeniedException');
        return Response.unauthorized(res, { message: "access denied !, user not authorized to access resource", status: 403 });
    };
}

// eslint-disable-next-line consistent-return
async function authJwt(req, res, next) {
    try {
        const token = await extractToken(req);
        const verify = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.auth = {
            user_id: verify?.id,
            role: await getRole(verify?.id, verify.client_code),
            client_db: verify.client_code,
        };

        // req.auth.role.id = (verify?.role);
        next();
    } catch (error) {
        if (error?.name) {
            res.set('x-server-errortype', error.name === "TokenExpiredError" ? 'AccessTokenExpired' : 'InvalidAccessTokenException');
            return Response.unauthorized(res, { message: error?.message });
        } 
        res.set('x-server-errortype', 'InternalServerError');
        return Response.error(res, { message: "something went wrong !" });
    }
}

async function authApi(req, res, next) {
    try {
        const regEx = /\b[0-9a-f]{64}\b/;
        if (!(
            (req.headers.authorization ||
            req.headers.Authorization) &&
            regEx.test(req.headers.authorization)
        ))  
            await generateCustomError('Authorization failed !', 'client', 401, 'InvalidAccessKeyException');
        
        
        let api_user = await DB.readOne(User, {
            api_key: req.headers.authorization || req.headers.Authorization
        });
        
        if (!Object.keys(api_user).length)
            await generateCustomError('Invalid access key !', 'client', 401, 'InvalidAccessKeyException');
        
        req.auth = { user_id: '', role: { id: '', name: '' } };
        req.auth.user_id = api_user.id;
        next();
    }
    catch (error) {
        console.log(error?.name)
        console.log('error -- ', error);
        if (error?.name) {
            res.set('x-server-errortype', 'InvalidAccessKeyException');
            return Response.unauthorized(res, { message: error?.message });
        } 
        res.set('x-server-errortype', 'InternalServerError');
        return Response.error(res, { message: "Something went wrong !" });
    }
}

module.exports = {
    authorize,
    authJwt,
    authApi,
};
