const Response = require('../Helpers/response.helper');
const { IST } = require('../Helpers/dateTime.helper');

const { generateCustomError } = require('../Helpers/error.helper');
const AuthHelper = require('../Helpers/auth.helper');
const DB = require('../Helpers/crud.helper');
const { getRole, removeKeys } = require('../Helpers/helper');
const User = require('../Database/Models/user.model');
const UserRole = require('../Database/Models/user_role.model');
const Role = require('../Database/Models/role.model');
const { readClientDB } = require("../Helpers/dbSelection.helper");

const { default: axios } = require('axios');

const {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY,
	APP_NAME
} = process.env;


/**
 * @description Tries to register the user with provided body
 * @params data {Object}
 * @returns Express res object with the success/failure and data
 */
async function register(req, res, next) {
	try {
		let client_db = await DB.read("default", "ClientDatabase", {
			client_id: req.body.client,
		});
		if (!client_db.length)
			await generateCustomError(
				"unable to find db",
				"system",
				500,
				"systemError",
			);
		// unique email check
		await DB.isUnique(
			client_db[0].client_code,
			User.userModelName,
			{ email: req.body.email },
			`email ${req.body.email}`,
		);
		await DB.isUnique(
			client_db[0].client_code,
			User.userModelName,
			{ phone: req.body.phone },
			`phone number ${req.body.phone}`,
		);
		if (!req.auth.role.role.includes('SUPER-ADMIN') && req.body?.user_name) 
			await DB.isUnique(
				client_db[0].client_code,
				User.userModelName,
				{ user_name: req.body.user_name },
				`user name ${req.body.user_name}`,
			);

		// hash password
		const passwordHash = await AuthHelper.generateHash(req.body.password);

		//generating api key for WEB_SERVICE not for normal user
		// req.body.api_key = await AuthHelper.generateAPI(req.body.username);

		let client_admin = [];
		if(req.auth.client_db === "default") client_admin = await DB.read(
			client_db[0].client_code,
			User.userModelName,
			{
				client_id: req.body.client,
			},
		);
		
		if (client_admin.length)
			await generateCustomError('admin already created !', 'bad_request', 400, 'clientError');

		let createdUser = await DB.create(
			client_db[0].client_code,
			User.userModelName,
			{
				name: req.body?.name || null,
				email: req.body?.email || null,
				phone: req.body?.phone || null,
				password: passwordHash,
				client_id:req.body.client,
				user_name: req.body?.user_name || null,
				department: req.body?.department || null,
				reporting_manager: req.body?.reporting_manager || null,
				cost_center: req.body?.cost_center || null,
				home_center: req.body?.home_center || null,
				address_1: req.body?.address_1 || null,
				address_2: req.body?.address_2 || null,
				role:req.body?.role || req.body?.roles || [],
				city: req.body?.city || null,
				state: req.body?.state || null,
				country: req.body?.country || null,
				pin_code: req.body?.pin_code || null,
				emergency_contact: req.body?.emergency_contact || null,
				relation_contact: req.body?.relation_contact || null,
				device_token: req.body.token || null,
				api_key: req.body?.api_key || null,
				created_at: IST(),
				updated_at: IST(),
			},
		);
		//array conversion if not an array
		if (!(createdUser instanceof Array)) createdUser = [{ ...createdUser }];

		Response.success(res, {
			data: {
				name: createdUser[0].name,
				email: createdUser[0].email || null,
				phone: createdUser[0].phone || null,
				id: createdUser[0].id,
				client_code: client_db[0].client_code,
			},
		});

	} catch (error) {
		next(error);
	}
}


const holisolUserLogin = (query) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await DB.read('default', User.userModelName, query, {}, {
				created_at: 0,
				updated_at: 0,
				__v: 0
			}, {});
			resolve(user);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and data
 */
const login = async (req, res, next) => {
	try {
		let query = {};

		if (req.body?.email) query.email = req.body.email;
		else if (req.body?.phone) query.email = req.body.phone;
		else await generateCustomError("BAD REQUEST", "bad_request", 400, 'clientError');

		
		let read_db = 'default';
		if (req.body.client) {
			read_db = await readClientDB({ client_code: req.body.client });
			// let client_db = await DB.read("default", "ClientDatabase", {
			// 	client_code: req.body.client,
			// });
			// if (!client_db.length)
			// 	await generateCustomError(
			// 		"unable to find db",
			// 		"system",
			// 		500,
			// 		"systemError",
			// 	);
			// read_db = client_db[0].client_code;
		}
		
		let user = await DB.read(
			read_db,
			User.userModelName,
			query,
			{},
			{
				created_at: 0,
				updated_at: 0,
				__v: 0,
			},
		);
			
		
		if (user.length) user[0].role = await getRole(user[0].id, read_db);
		// if (user.length) user[0].role = await getRole(user[0].id);

		// if (user.length) user.permissions = await getPermissions(user[0].client, user[0].role.id);

		if (!user.length)
			await generateCustomError("Please register and try again !", "user_not_found", 401, 'clientUnautorized');

		if ('is_deleted' in user[0] && user[0]?.is_deleted)
			await generateCustomError("Your account is blocked ! please contact holisol admin", "account_blocked", 401, 'clientUnautorized');
		if ('finance_validation' in user[0] && !user[0]?.finance_validation)
			await generateCustomError("Your registration request is pending ! please try again after some time", "account_blocked", 403, 'clientUnautorized');

		await AuthHelper.compareHash(req.body.password, user[0].password);

		if ('password' in user[0]) delete user[0].password;
		if ('is_deleted' in user[0]) delete user[0].is_deleted;
		if ('refresh_token' in user[0]) delete user[0].refresh_token;

		const accessToken = await AuthHelper.generateToken(
			{
				role: user[0].role,
				id: user[0].id,
				device_token: req.body?.token,
				client_code: read_db
			},
			ACCESS_TOKEN_EXPIRY,
			ACCESS_TOKEN_SECRET,
		);

		// eslint-disable-next-line max-len
		const refreshToken = await AuthHelper.generateToken(
			{
				role: user[0].role,
				id: user[0].id,
				device_token: req.body?.token,
				client_code: read_db
			},
			REFRESH_TOKEN_EXPIRY,
			REFRESH_TOKEN_SECRET,
		);

		res.cookie(APP_NAME, JSON.stringify({ refreshToken }), {
			secure: true,
			httpOnly: true,
			expires: IST('date', 7, 'days'),
			sameSite: 'none'
		});

		Response.success(res, {
			data: {
				user: { ...user[0] },
				client_code: read_db,
				accessToken: accessToken,
				refresh_token: refreshToken,
				device_token: req.body.token,
				date: IST(),
			},
		});

		await DB.update(read_db, User.userModelName, {
			query: { _id: user[0].id },
			data: { device_token: req.body.token, refresh_token: refreshToken, updated_at: IST('database') }
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
const getUser = async (req, res, next) => {
	
	try {
		let queryExclude = {
			password: 0,
			is_deleted: 0,
			refresh_token: 0,
			created_at: 0
		}
		// const user = await User.find({_id: req.auth.user_id }, queryExclude);
		const user = await DB.readOne(req.auth.client_db, User.userModelName, {_id: req.auth.user_id });
		user.role = await getRole(user.id, req.auth.client_db);
		// user.permissions = await getPermissions(user.client, user.role.id);
		
		// console.log(user);
		if (!user)
			await generateCustomError("Please register and try again !", "user_not_found", 401, 'clientUnautorized');
		if (user?.is_deleted)
			await generateCustomError("Account Blocked !", "account_blocked", 401, 'clientUnautorized');


		Response.success(res, {
			data: {
				user: user,
				date: IST()
			}
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and generated token
 */
const generateTokens = async (req, res, next) => {
	try {
		if(!(APP_NAME in req.cookies)) await generateCustomError("BAD REQUEST", "bad_request", 401, "clientError");
		let token = JSON.parse(req.cookies[APP_NAME]);
		token = token?.refreshToken;
		if (!token) await generateCustomError("BAD REQUEST", "bad_request", 400, 'clientError');
		const verify = await AuthHelper.verifyToken(token, REFRESH_TOKEN_SECRET);
		// const user = await holisolUserLogin({ _id: verify?.id });
		const user = await DB.read(
			verify.client_code,
			User.userModelName,
			{ _id: verify?.id },
			{},
			{
				created_at: 0,
				updated_at: 0,
				__v: 0,
			},
		);

		if (!user.length)
			await generateCustomError("Please register and try again !", "user_not_found", 401, 'clientUnautorized');

		if ('is_deleted' in user[0] && user[0]?.is_deleted)
			await generateCustomError("Your account is blocked ! please contact holisol admin", "account_blocked", 401, 'clientUnautorized');
		if ('finance_validation' in user[0] && !user[0]?.finance_validation)
			await generateCustomError("Your registration request is pending ! please try again after some time", "account_blocked", 403, 'clientUnautorized');

		const accessToken = await AuthHelper.generateToken(
			{
				role: await getRole(verify?.id, verify.client_code),
				id: user[0].id,
				client_code: verify.client_code,
			},
			ACCESS_TOKEN_EXPIRY,
			ACCESS_TOKEN_SECRET,
		);
		return Response.success(res, { data: { accessToken } });
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			error.resHeader = 'AccessTokenExpired';
			error.resStatus = 401;
		} 
		next(error);
	}
};

const logout = async (req, res, next) => {
	try {
		const { user_id } = req.auth;
		await DB.update(req.auth.client_db, User.userModelName, { query: { _id: user_id }, data: { refresh_token: '', active_status: false, updated_at: IST('database') } });
		res.clearCookie(APP_NAME);
		return Response.success(res, { message: 'user logged out !' });
	} catch (error) {
		next(error);
	}
};


module.exports = {
	register,
	login,
	logout,
	generateTokens,
	getUser
};
