// //util/database.js
/*
This is commented because mongoose takes charge of all this utility management and management of the connection
*/

// const env = require("dotenv").config();
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const uri = process.env.MONGODB;

// let _db; // declaration to store and reuse your database connection.

// const mongoClient = new MongoClient(uri); //  declaration to manage your MongoDB connection.

// async function mongoConnect(callback) {
//   // this is an async function that will start the server
//   try {
//     // this is a try catch block that will catch any errors
//     await mongoClient.connect(); // this will connect to the database
//     console.log("Connected!"); // this will log a message to the console
//     _db = mongoClient.db(); // this will store the database connection
//     callback(); // this will execute the callback function
//   } catch (err) {
//     console.log(err);
//     await mongoClient.close(); // Close the connection if an error occurs during the connection or server startup
//   }
// }

// function getDb() { // to access your database connection throughout your application.
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// }

// module.exports = { mongoConnect, getDb };

////=================================
// module.mongoConnect = mongoConnect; // method to connect and storing variable to database
// module.getDb = getDb; //return access to that database

//SEQUELIZE CODE
// const env = require("dotenv").config();
// const Sequelize = require("sequelize");

// const password = process.env.PASSWORD_MYSQL

// const sequelize = new Sequelize("node-complete", "root", password, {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

//Sequelize does this behind the scenes
// const mysql = require('mysql2');
// require('dotenv').config();

// const password = process.env.PASSWORD_MYSQL;

// // create a pool of connections
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "node-complete",
//     password: password
// });

// // promises are better than callbacks
// module.exports = pool.promise(); // this will export a promise
