const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null; // this will create a new object id if the id is not null
  }

  async save() {
    const db = getDb(); // this will return the database object
    let dbOp;

    try {
      if (this._id) {
        // update the product
        dbOp = await db
          .collection("products")
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        // insert the product
        dbOp = await db.collection("products").insertOne(this);
      }
    } catch (err) {
      console.log(err);
      // Handle the error according to your application's needs
      // Could rethrow, return null, or handle it in some other way
      throw err; // or return null;
    }

    return dbOp;
  }

  static async deleteById(prodId){
    const db = getDb(); // this will return the database object

    try {
      const dbOp = await db.collection("products").deleteOne({_id: new mongodb.ObjectId(prodId)}); // this will delete the product
      console.log("Deleted");
      return dbOp;
    } catch (err){
      console.log(err);
    }
  }

  static async fetchAll() {
    const db = getDb(); // this will return the database object

    try {
      const products = await db.collection("products").find().toArray(); // this will return all the products
      console.log(products);
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId) {
    const db = getDb(); // this will return the database object

    try {
      const product = await db
        .collection("products")
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next();
      console.log(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;

// ** SEQUELIZE **

// // this will create a new model
// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER, // this will create an integer column
//     autoIncrement: true, // this will auto increment the id
//     allowNull: false, // this will not allow null values
//     primaryKey: true, // this will set the id as the primary key
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
// });

// module.exports = Product;

// ** USING JUST SQL **
// // const fs = require("fs");
// // const path = require("path");
// // const rootDir = require("../util/path");
// const db = require("../util/database");

// const Cart = require("./cart");

// // const p = path.join(rootDir, "data", "products.json");

// // const getProductsFromFile = (cb) => {
// //   fs.readFile(p, (err, fileContent) => {
// //     // this is a callback function that will be executed once the file is read
// //     if (err) {
// //       cb([]); //if there is an error, return an empty array
// //     } else {
// //       cb(JSON.parse(fileContent)); // this will parse the file content into a javascript object
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     // we can use the ? to avoid sql injection attacks
//     return db.execute(
//       "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",   // this is the query
//       [this.title, this.price, this.description, this.imageUrl] // this is an array of values that will be inserted into the query
//     ); // we return the promise
//   }

//   static deleteById(id) {}

//   static fetchAll() {
//     return db.execute("SELECT * FROM products"); // this will execute the query and we return the promise
//   }

//   static findById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]); // this will execute the query and we return the promise
//   }
// };
