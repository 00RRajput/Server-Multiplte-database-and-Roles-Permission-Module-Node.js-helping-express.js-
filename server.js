const { createServer } = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const {
	connection,
	makeConnection,
	connectAllClients,
} = require("./Database/connection");
const Logger = require("./Helpers/logger");
const { IST } = require("./Helpers/dateTime.helper");
const HandleError = require('./Middleware/errorHandler.middleware');


const server = createServer(app);

const { PORT, NODE_ENV } = process.env;

const httpServer = server.listen(PORT || 9083, async (error) => {
    // Logger.info(`Server started connection on port ${PORT || 9081}`);
    if (error) {
        Logger.error(error);
        process.exit(1);
    }
    try {
        await makeConnection();
        // await connection('default');
        await connectAllClients();
        console.log(` 🖥 server started on port 🕹: [${PORT || 9081}] with [${(NODE_ENV).toUpperCase()} --env] 🇮🇳 [${IST("date")} ${IST('time')}] `);
    } catch (connectionError) {
        console.error("Unable to connect --DATABASE, Killing app 🤯🤣", connectionError);
        Logger.error(connectionError); 
        process.exit(1);
    }
});


const io = new Server(httpServer, {
    maxHttpBufferSize: 1024,
    pingInterval: 60 * 1000,
    pingTimeout: 60 * 4000,
    cors: {
        origins: process.env.CORS_URLS.split(", "),
    },
});

require("./Controllers/socket.controller")(io);

//? routes
require("./Routes")();

//? error handler middleware
app.use(HandleError);

//? setting socket io as global
global.io = io;