const { limitationModelName } = require('../Database/Models/limitation.model');
const { yardModelName } = require('../Database/Models/yard.model');
const DB = require("../Helpers/crud.helper");
const Response = require('../Helpers/response.helper');
const { roleModelName } = require("../Database/Models/role.model");
const { userModelName } = require("../Database/Models/user.model");

const { rolePermissionsSchema } = require("../Database/Models/role_permissions.model");

/**
 * @param {string} input - string to sanitize.
 * @returns {string} sanitized string for database name
 * @description snitizes a given string for database name
 */
function sanitizeDatabaseName(input) {
	// Define a regular expression to match invalid characters
	const invalidCharsRegex = /[^a-zA-Z0-9-_]/g;

	// Replace invalid characters with an empty string
	const sanitizedName = input.replace(invalidCharsRegex, "");

	// Ensure the result is not an empty string (a valid database name cannot be empty)
	if (sanitizedName.length === 0) {
		throw new Error("Invalid database name");
	}

	return sanitizedName;
}

/**
 * @param {ObjectId} auth_id - Array of keys to be removed from the data.
 * @returns {error} error error instance
 * @description generates a custom error with given inputs
 */

function getRole(auth_id, database = 'default') {
	return new Promise(async (resolve, reject) => {
		try {
			let Database = global.getConnection(database);
			const Model = Database.models[userModelName];
			let roles = await Model.find({ _id: auth_id }, { role: 1 })
				.populate("role", { created_at: 0, updated_at: 0, _v: 0 })
				.lean()
				.exec(); // Execute the query

			let id = [];
			let name = [];
			
			roles[0].role.map((role) => {
				id.push(role._id);
				name.push(role.role);
			});

			let newArray = { id: id, role: name };
			resolve(newArray);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * @param {ObjectId} client
 * @param {object|array} role_id - Data object or array to be processed.
 * @returns {error} error error instance
 * @description generates a custom error with given inputs
 */

function getPermissions(role_id, database = "default") {
	let Database = global.getConnection("", database);

	const Model = Database.models[roleModelName];

	return new Promise(async (resolve, reject) => {
		try {
			let permissions = await Model.find(
				{ role_id: role_id },
				{ _id: 0, permission: 1, status: 1 }
			).lean();

			permissions = permissions
				.map((permission) => (permission.status ? permission.permission : ""))
				.filter((permission) => permission !== "");
			resolve(permissions);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Remove specified keys from the given data object or array, and transform it according to the specified children keys.
 * @param {array} keys - Array of keys to be removed from the data.
 * @param {object|array} data - Data object or array to be processed.
 * @param {array} children - Array of keys representing children keys for recursive processing.
 * @returns {object|array} - Transformed data object or array with specified keys removed.
 */
function removeKeys(keys, data, children = []) {
	if (data instanceof Array) {
		return data.map((item) => removeKeys(keys, item, children));
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

/**
 * Remove specified keys from the given data object or array, and transform it according to the specified children keys.
 * @param {array} keys - Array of keys to be removed from the data.
 * @param {object|array} data - Data object or array to be processed.
 * @param {array} children - Array of keys representing children keys for recursive processing.
 * @returns {object|array} - Transformed data object or array with specified keys removed.
 */
function checkRoles(user_role, roles) {
	return (
		user_role.length &&
		roles.length &&
		user_role.every((element) => roles.includes(element))
	);
}

/**
 *
 * @param {express response instance} res
 * @param {String} type
 * @param {Boolean} status
 * @returns {error} error error instance
 * @description generates a custom error with given inputs
 */

const checkLimition = async (req, res, next, type='', status=false) => {
    if(type=='' && !status) return 1;
    let count, limit;
    limit = await DB.readOne(req.auth.client_db, limitationModelName, { type:type }, { limit: 1})
    limit = limit.limit;

    switch (type) {
      case 'yard_limit':
        count = await getModelCount(req, yardModelName)
        break;
    
      default:
        break;
    }
    console.log(count)
    if (status && count <= limit) return count;
    return false;
    // return Response.success(res, { count: count, message: 'You have no limt'});
}

/**
 *
 * @param {Model} Model
 */
function getModelCount(req, Model) {
  return new Promise(async (resolve, reject) => {
    let pipe = [
      {
        $match: {isActive: true}
      },
      {
        $group: { 
          _id: null,
          count: {$sum: 1}
        }
      }
    ];
    let data = await DB.aggregation(req.auth.client_db, Model, pipe);
   
    if (data.length) resolve(data[0].count + 1);
    else resolve(1);
  })
}

/**
 *
 * @param {String} type
 * @returns {error} error error instance
 * @description modify name ex. (user_name = User Name)
 */
const ModifyName = (name) => {
	const arr = name.split("_");
	for (var i = 0; i < arr.length; i++) {
	  arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	return arr.join(" ");
  };

module.exports = {
	getRole,
	removeKeys,
	checkRoles,
	getPermissions,
	sanitizeDatabaseName,
	checkLimition,
	ModifyName
};
