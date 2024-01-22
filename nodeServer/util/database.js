const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri);

module.exports = client;

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
