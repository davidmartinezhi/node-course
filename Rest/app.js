const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express(); // this will create an express application

//routes
const feedRoutes = require("./routes/feed");

//middleware
//app.user(bodyParser.urlencoded({ extended: false })); // this will parse the body of the incoming request from forms in format x-www-form-urlencoded
app.use(bodyParser.json()); // this will parse the body of the incoming request
app.use((req, res, next) => {
    //every response will have these headers
    //I can lock this dow to my specific frontend domain. multiple domains can be separated by commas
    res.setHeader("Access-Control-Allow-Origin", "*"); // this will allow access to any client from the server
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"); // this will allow the methods that can be used
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // this will allow the headers that can be used
    next();
});

app.use('/feed', feedRoutes); // this will register the feedRoutes

mongoose.connect(
    "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/messages?retryWrites=true&w=majority", // this will connect to the database
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(result => {
    app.listen(8080); // this will start a server on port 3000
}).catch(err => {
    console.log(err);
});