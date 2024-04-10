const express = require("express");

const app = express(); // this will create an express application

const feedRoutes = require("./routes/feed");

app.use('/feed', feedRoutes); // this will register the feedRoutes

app.listen(8080); // this will start a server on port 3000