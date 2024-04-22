let io;

module.exports = {
    init: (httpServer) => { // this function will initialize the socket.io server
        io = require("socket.io")(httpServer, { // we pass the httpServer to the socket.io function
            cors: { // we set the cors options
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        return io; // we return the io object
    },
    getIO: () => {
        if (!io) { // if io is not initialized
            throw new Error("Socket.io not initialized!");
        }
        return io; // we return the io object
    }
};