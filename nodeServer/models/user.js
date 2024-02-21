const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, id) {
    this.username = username;
    this.email = email;
    //this._id = id ? new mongodb.ObjectId(id) : null;
  }

  async save() {
    const db = getDb();
    return db.collection("users").insertOne(this);

    // const db = getDb();
    // let dbOp;

    // try {

    //   //check if we are editing an existing user
    //   if(this._id){
    //     dbOp = await db.collection("users").updateOne({ _id: this._id }, { $set: this }); // this will update the user
    //     console.log("Updated User");
    //     return dbOp;
    //   }

    //   //check if we are adding a new user
    //   else{
    //     dbOp = await db.collection("users").insertOne(this); // this will insert the user
    //     console.log("Inserted User");
    //     return dbOp;
    //   }

    // } catch (err) {
    //   console.log(err);
    // }
  }

  static async findById(userId) {
    const db = getDb();

    return db.collection("users").findOne({ _id: new ObjectId(userId) });

    // const db = getDb();

    // try {
    //   const user = await db
    //   collection("users").findOne({_id : new mongodb.ObjectId(userId)});
    //   console.log("Found User: " + user);
    //   return user;
    // } catch (err) {
    //   console.log(err);
    // }
  }
}

module.exports = User;
// ** USING SQL ORM: SEQUELIZE **
// const Sequelize = require("sequelize"); // this will import the sequelize package

// const sequelize = require("../util/database"); // this will import the sequelize instance

// // this will create a new model
// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER, // this will create an integer column
//     autoIncrement: true, // this will auto increment the id
//     allowNull: false, // this will not allow null values
//     primaryKey: true, // this will set the id as the primary key
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   }
// });

// module.exports = User;
