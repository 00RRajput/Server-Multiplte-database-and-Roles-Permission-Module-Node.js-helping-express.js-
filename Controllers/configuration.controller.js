const DB = require("../Helpers/crud.helper");
const UserConfiguration = require("../Database/Models/user_configuration.model");
const UserConfig = require("../Database/Models/user_config.model");
const Client = require("../Database/Models/client.model");
const Response = require("../Helpers/response.helper");
const { generateCustomError } = require("../Helpers/error.helper");
const DateTime = require("../Helpers/dateTime.helper");

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with user data / error }
 */
const read = async (req, res, next) => {
	try {
		let query = {};
		let sort = { _id: 1 };
		let pagination = {};

		if (!req.query?.all) query.isActive = true;

		const data = await DB.read(
			'default',
			UserConfiguration.userConfigurationModelName,
			query,
			pagination,
			{
				created_at: 0,
				updated_at: 0,
				__v: 0,
			},
			sort,
		);

		Response.success(res, {
			data: { data },
			message: "user fields sent !",
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
const readUserField = async (req, res, next) => {
	try {
		let query = {};
		let sort = { _id: 1 };
		let pagination = {};
		let data, clientDb;
		let newData = {};

		if (!req.query?.all) query.client_id = req.params.id;
		
		if (req.params.id == 'default') clientDb = req.auth.client_db;
		else clientDb = await DB.readOne(
			'default',
			Client.clientModelName,
			{_id: req.params.id}
			);
			
		data = await DB.read(
			clientDb?.client_code ?? clientDb,
			UserConfig.userConfigModelName,
			query,
			pagination,
			{
				created_at: 0,
				updated_at: 0,
				__v: 0,
			},
			sort,
		);
		
		if (!data.length) {
			let config_data = userConfigData(req);
			
			config_data.map(async (data) => {
				await DB.create(
					clientDb.client_code,
					UserConfig.userConfigModelName,
					data
				)
			});
		}

		for (let i = 0; i < data.length; i++) {
			newData[data[i].type] = data[i];
		}

		Response.success(res, {
			data: newData,
			message: "user fields sent !",
		});
	} catch (error) {
		next(error);
	}
};

const userConfigData = (req) => {
	return [
		{
			type: "visibility",
			full_name: true,
			email: true,
			phone: true,
			user_name: true,
			department: false,
			reporting_manger: false,
			cost_center: false,
			home_center: false,
			role: true,
			address: false,
			address_2: false,
			city: false,
			state: false,
			country: false,
			pincode: false,
			emergency_contact: false,
			relation: false,
			password: true,
			confirm_password: true,
			created_at: DateTime.IST("database"),
			updated_at: DateTime.IST("database"),
		},
		{
			type: "integration",
			full_name: false,
			email: false,
			phone: false,
			user_name: false,
			department: false,
			reporting_manger: false,
			cost_center: false,
			home_center: false,
			role: false,
			address: false,
			address_2: false,
			city: false,
			state: false,
			country: false,
			pincode: false,
			emergency_contact: false,
			relation: false,
			password: false,
			confirm_password: false,
			created_at: DateTime.IST("database"),
			updated_at: DateTime.IST("database"),
		},
	];
};

/**
 *
 * @param {express request instance} req
 * @param {express response instance} res
 * @param {to access next middleware} next
 * @returns { Response instance with sucess / error }
 */
const menuList = async (req, res, next) => {
	try {
		let query = {};
		let pagination = {};

		query.isActive = true;

		const data = await DB.read(
			'default',
			Client.clientModelName,
			query,
			pagination,
			{
				created_at: 0,
				updated_at: 0,
				__v: 0,
			}
		);

		Response.success(res, {
			data: { data },
			message: "Client list sent",
		});
	} catch (error) {
		next(error);
	}
};

const updateUserConfig = async (req, res, next) => {
	let datas = userConfigUpdateData(req.body);
	// const updateOperations = datas.map((data) => ({
	// 	updateOne: {
	// 		filter: { client_id: req.params.id, type: data.type }, //  Match documents based on name
	// 		update: { $set: data }, // Update email field
	// 	},
	// }));
	let clientDb = await DB.readOne(
		'default',
		Client.clientModelName,
		{_id: req.params.id}
	);
	
	datas.map(async (data) => {
		await DB.update(
			clientDb.client_code,
			UserConfig.userConfigModelName,
			{
				query: {_id: data.id},
				data: data
			}
		)
	})
	// UserConfig.bulkWrite(updateOperations);

	// for (let i = 0; i < data.length; i++) {
	// 	console.log(req.params.id);
	// 	await UserConfig.updateOne(
	// 		{
	// 		  client_id: req.params.id,
	// 		  type: data[i].type,
	// 		  // Add more conditions here if needed
	// 		},
	// 		data
	// 	  );
	// }
	Response.success(res, {
		data: {},
		message: "removed Configuration updated !",
	});
};

const userConfigUpdateData = (data) => {
	return [
		{
			id: data.id.visibility,
			type: "visibility",
			full_name: data.fullname.visibility,
			email: data.email.visibility,
			phone: data.phone.visibility,
			user_name: data.user_name.visibility,
			department: data.department.visibility,
			reporting_manger: data.reporting_manager.visibility,
			cost_center: data.cost_center.visibility,
			home_center: data.home_center.visibility,
			role: data.role.visibility,
			address: data.address.visibility,
			address_2: data.address_2.visibility,
			city: data.city.visibility,
			state: data.state.visibility,
			country: data.country.visibility,
			pincode: data.pincode.visibility,
			emergency_contact: data.emergency_contact.visibility,
			relation: data.relation.visibility,
			password: true,
			confirm_password: true,
			updated_at: DateTime.IST("database"),
		},
		{
			id: data.id.integration,
			type: "integration",
			full_name: data.fullname.integration,
			email: data.email.integration,
			phone: data.phone.integration,
			user_name: data.user_name.integration,
			department: data.department.integration,
			reporting_manger: data.reporting_manager.integration,
			cost_center: data.cost_center.integration,
			home_center: data.home_center.integration,
			role: data.role.integration,
			address: data.address.integration,
			address_2: data.address_2.integration,
			city: data.city.integration,
			state: data.state.integration,
			country: data.country.integration,
			pincode: data.pincode.integration,
			emergency_contact: data.emergency_contact.integration,
			relation: data.relation.integration,
			password: false,
			confirm_password: false,
			updated_at: DateTime.IST("database"),
		},
	];
};

module.exports = {
	read,
	readUserField,
	menuList,
	updateUserConfig,
};
