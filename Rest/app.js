const express = require("express");
const bodyParser = require("body-parser");

const app = express(); // this will create an express application

//routes
const feedRoutes = require("./routes/feed");

//middleware
//app.user(bodyParser.urlencoded({ extended: false })); // this will parse the body of the incoming request from forms in format x-www-form-urlencoded
app.use(bodyParser.json()); // this will parse the body of the incoming request

app.use('/feed', feedRoutes); // this will register the feedRoutes

app.listen(8080); // this will start a server on port 3000