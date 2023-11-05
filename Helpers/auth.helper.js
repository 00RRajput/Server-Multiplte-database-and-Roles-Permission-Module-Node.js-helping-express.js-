const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto=require("crypto");


/**
 * @description generates api hash against username
 * @param name string:provided by the user
 * @returns return the hashed api key
 */
async function generateAPI(name)
{
    return new Promise(async(resolve,reject)=>
    {
        try {
            const hash = crypto.createHash('sha256',name)
            .digest('hex')
            resolve(hash);
        } catch(error) {
            reject(error)
        } 
    })
}
/**
 * @description generates hashed password for plain password
 * @param password string: password provided by user
 * @returns  hashed password or false
 */
async function generateHash(password) {
    return new Promise(async (resolve, reject) => { 
        try {
            const saltRounds = 12;
            const plainPassword = password;
            let hashedPassword;
            hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
            resolve(hashedPassword);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * @description generates json web token for provided user with expiry time
 * @param user {object} user object
 * @param time token expiry time {'1h', '1M', 60*60}
 * @param secret secret key to sign jwt
 * @returns json web token or false
 */
async function generateToken(data, time, secret) {
    return new Promise(async (resolve, reject) => { 
        try {
            const token = jwt.sign(data, secret, { expiresIn: time });
            resolve(token);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * @description generates json web token for provided user with expiry time
 * @param token jwt token
 * @param secret jwt secret
 * @returns Promise
 */
async function verifyToken(token, secret) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = jwt.verify(token, secret);
            if (data?.expired) {
                let error = new Error("token_expired");
                error.name = "auth_token_error";
                error.resCode = 401;
                error.resHeader = '';
                reject(error);
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description extracts Bearer token from request headers
 * @param req req object
 * @returns Promise
 */
function extractToken(req) {
    return new Promise(async (resolve, reject) => { 
        try {
            //? checking if auth header exists
            if (!Object.prototype.hasOwnProperty.call(req.headers, "authorization")) {
                let error = new Error("malformed authorization !");
                error.name = "auth_error";
                reject(error);
            }
            let { authorization: token } = req.headers;
            
            //? checking if header value contains Bearer
            if (!token.startsWith("Bearer")) {
                let error = new Error("malformed authorization header !");
                error.name = "auth_error";
                error.resCode = 400;
                reject(error);
            }
            // eslint-disable-next-line prefer-destructuring
            token = token.split(" ")[1];
            resolve(token);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description compares provided hash with user password
 * @param userPassword string: password provided by user
 * @param hash string: password hash from database
 * @returns Promise
 */
async function compareHash(userPassword, hash) {
    return new Promise(async (resolve, reject) => {
        try {
            const match = await bcrypt.compare(userPassword, hash);
            if (match) resolve(true);
            let error = new Error('incorrect username or password');
            error.name = "auth_error";
            error.resCode = 401;
            reject(error);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateAPI,
    generateHash,
    generateToken,
    verifyToken,
    extractToken,
    compareHash,
};
