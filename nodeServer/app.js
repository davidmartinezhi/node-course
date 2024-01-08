//const http = require('http'); //without express
/*
const express = require('express');

const app = express(); // this initializes a new express object where the framwework stores and manages things for us
*/
/*
 Express JS is all about middleware
 Incoming requests are funneled through a bunch of functions
 before we send a response
 In this way we pass thrpugh blocks of code before responding
*/

// this is a function that allows us to add a new middleware function
//Allows us to use array of middleware functions
//Whatrever we add will be used for every incoming request
// app.use((req, res, next) => {
//     console.log('In the middleware!');
//     next(); // this allows the request to continue to the next middleware in line
// }); // next is a function that will be passed to the middleware function by express)); 
/*
app.use('/add-product', (req, res, next) => { //if it starts with /add-product, it will execute this middleware
    console.log('In another middleware');
    res.send('<h1>Hello from Express! Add product</h1>');
});

app.use("/", (req, res, next) => { //if it starts with /, it will execute this middleware. other routes must be on top
    console.log('In the next middleware');
    res.send('<h1>Hello from Express!</h1>');
});
*/
//const routes = require('./routes_vanilla-node'); // we can omit the .js extension

// function rqListener(req, res){

// }

// http.createServer(rqListener); // rqListener is a function that will be executed for every incoming request

// const server = http.createServer(app); // we can also use an anonymous function
// server.listen(3000); // this will keep the server running and listening for incoming requests
//app.listen(3000); // this is a shortcut for the above code
