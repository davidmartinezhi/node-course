const http = require('http'); // this is a core module

const routes = require('./routes'); // we can omit the .js extension

const server = http.createServer(routes); // creeated a server

server.listen(3000); // this will keep the server running and listening for incoming requests