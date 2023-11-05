const Logger = require("../Helpers/logger");



function initSocket(io) {
    //? Listening for any event
    io.on("connection", async (socket) => {

        Logger.info(`New socket connected`);
        socket.emit("success", { auth: false });

        socket.on('join_announcement', (data) => {
            if (!data?.id || !data?.type) {
                socket.disconnect();
                return;
            }
            // joinAnnouncementRoom(socket, { first: data.type, second: data.id });
        });
        socket.on('join_room', (room) => {
            socket.join(room);
        });

    });
}

module.exports = initSocket;