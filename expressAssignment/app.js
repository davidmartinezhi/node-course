const express = require('express'); // import express

const app = express(); // create express app

app.get('/favicon.ico', (req, res) => res.status(204)); // this is a workaround for the favicon.ico error
/*
app.use((req, res, next) => {
    console.log('First Middleware', req.url, req.method);
    next();
});

app.use((req, res, next) => {
    console.log('Second Middleware', req.url, req.method);
    res.send('<h1>Hello from Express!</h1>');
});
*/

app.use('/users', (req, res, next) => {
    console.log('In the users middleware!');
    res.send('<h1>The "Users" Page</h1>');
}); // this will match /users and /users/anything

app.use('/', (req, res, next) => {
    console.log('In the "/" middleware!');
    res.send('<h1>The "/" Page</h1>');
}); // this will match / and /anything

app.listen(3000);