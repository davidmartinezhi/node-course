const path = require('path');

// 3th party modules
const express = require('express');
const bodyParser = require('body-parser');

//import routes
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');

//initiate express
const app = express();

//add body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

//add static middleware
app.use(express.static(path.join(__dirname, "public")));

//add routes
app.use("/user", userRoutes);
app.use(homeRoutes);

//catch all routes
app.use("/", (req, res, next) => {
    console.log("page not found");
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});


//listen to the port 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001'); //log to the console
});