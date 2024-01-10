//const http = require('http'); //without express
const path = require('path'); // this is a core module

const express = require('express');
const bodyParser = require('body-parser'); // this is a package that allows us to parse the body of the request

const adminRoutes = require('./routes/admin');
const shopRoutes = require("./routes/shop");

const app = express(); // this initializes a new express object where the framwework stores and manages things for us

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

// Middleware functions are executed in the order they are defined

//urlencoded is a function that returns a middleware function
app.use(bodyParser.urlencoded({extended: false}));

app.use("/admin", adminRoutes); // this will register the adminRoutes middleware
app.use(shopRoutes);

app.use("/", (req, res, next) => { //if it starts with /, it will execute this middleware. other routes must be on top
    console.log('In the next middleware');
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});


//const routes = require('./routes_vanilla-node'); // we can omit the .js extension

// function rqListener(req, res){

// }

// http.createServer(rqListener); // rqListener is a function that will be executed for every incoming request

// const server = http.createServer(app); // we can also use an anonymous function
// server.listen(3000); // this will keep the server running and listening for incoming requests
app.listen(3000); // this is a shortcut for the above code
