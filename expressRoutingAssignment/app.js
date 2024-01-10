
// 3th party modules
const express = require('express');
const bodyParser = require('body-parser');

//initiate express
const app = express();

//add body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

//add static middleware
app.use(express.static(__dirname + "/public"));

//add routes


//listen to the port 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001'); //log to the console
});