const { clientDbModelName } = require('../Database/Models/client_database.model');
const DB = require("../Helpers/crud.helper");
const { IST } = require("../Helpers/dateTime.helper");
const { makeConnection } = require("../Database/connection");
const { generateCustomError } = require('./error.helper');

const createClientDB = (client_id, client_code, client_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let CLIENT_DB_NAME = client_name;
            try {
                await DB.isUnique("default", clientDbModelName, {
                    db_name: client_name,
                });
            } catch (error) {
                const letters = 'abcdefghijklmnopqrstuvwxyz';
                let loopVar = Math.round(Math.random() * 10);
                while (loopVar > 0) {
                    CLIENT_DB_NAME += letters[Math.round(Math.random() * 26)];
                    loopVar--;
                }
            }
            const database = await DB.create("default", clientDbModelName, {
                client_id,
                client_code,
                db_name: CLIENT_DB_NAME,
                created_at: IST(),
                updated_at: IST(),
            });
            
            const connection = await makeConnection(database);
            resolve(connection);
        } catch (error) {
            reject(error);
        }
    })
    
}

const readClientDB = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const clientDb = await DB.read("default", clientDbModelName, query);
            if (!clientDb.length) await generateCustomError(`Unable to find client Database ! 🤯`, 'system', 500, 'serverError')
            resolve(clientDb[0].client_code);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
	createClientDB,
	readClientDB,
};