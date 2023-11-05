const mongoose = require("mongoose");
const { read } = require("../Helpers/crud.helper");
const { DATABASE, DATABASE_LOCATION } = process.env;
const { registerAdminModel, registerClientModel } = require("./register.model");

const connections = {};

const connectDB = (uri) => mongoose.createConnection(uri);

const makeConnection = async (clientObj = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingConnections = Object.keys(connections);
            if (!existingConnections.length && !("default" in connections)) {
                const connection = await (async () => mongoose.connect(DATABASE))();
                console.log("default DB connected 🚀 ");
                connections["default"] = {
                    connection,
                    client_code: "default",
                };
                await registerAdminModel(connection);
                await registerClientModel(connection);
                resolve(connection);
            }

            if (Object.keys(clientObj).length) {
                console.log("connecting DB 🚀 ", clientObj.client_code);
                const connection = connectDB(
                    `${DATABASE_LOCATION}${clientObj.db_name}`,
                );
                connections[clientObj.client_code] = {
                    connection,
                    client_code: clientObj.client_code,
                };
                const registered = await registerClientModel(connection);
                if (registered) resolve(connection);
            }

        } catch (error) {
            reject(error);
        }
    });
};

const connectAllClients = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const clientDbs = await read("default", "ClientDatabase", {});
            if (clientDbs.length) {
                // clientDbs.map(makeConnection);
                for (let database of clientDbs) {
                    await makeConnection(database);
                }
            }
            resolve(true);   
        } catch (error) {
            reject(error);
        }
    })
}

const getConnection = (client = "", client_code = "") => {
    console.log({ client, client_code });
    if (client) {
        if (client in connections) return connections[client].connection;
        return new Error(`No data base found ! for given client. 🤯`);
    }

    if (client_code) {
        for (let connectionData in connections) {
            if (connectionData.client_code === client_code)
                return connectionData.connection;
        }
    }
    return new Error(`no data base found ! for given client_code. 🤯`);
}

global.getConnection = getConnection;

module.exports = {
	connection: getConnection,
	makeConnection: makeConnection,
	connectAllClients,
};
