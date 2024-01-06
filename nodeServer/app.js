const http = require('http');

const routes = require('./routes'); // we can omit the .js extension

// function rqListener(req, res){

// }

// http.createServer(rqListener); // rqListener is a function that will be executed for every incoming request

const server = http.createServer(routes); // we can also use an anonymous function


server.listen(3000); // this will keep the server running and listening for incoming requests