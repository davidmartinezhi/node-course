const express = require('express');
const bodyParser = require('body-parser');

const todoRoutes = require('./routes/todos');

const app = express();

app.use(bodyParser.json()); //parse json data to js object

app.use((req, res, next) => {
    console.log('Middleware');
    next();
});

app.use(todoRoutes);

app.listen(3000);