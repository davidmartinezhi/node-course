// const fs = require("fs");
// const path = require("path");
// const rootDir = require("../util/path");
const db = require("../util/database");

const Cart = require("./cart");

// const p = path.join(rootDir, "data", "products.json");

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     // this is a callback function that will be executed once the file is read
//     if (err) {
//       cb([]); //if there is an error, return an empty array
//     } else {
//       cb(JSON.parse(fileContent)); // this will parse the file content into a javascript object
//     }
//   });
// };

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // we can use the ? to avoid sql injection attacks
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",   // this is the query
      [this.title, this.price, this.description, this.imageUrl] // this is an array of values that will be inserted into the query
    ); // we return the promise
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products"); // this will execute the query and we return the promise
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]); // this will execute the query and we return the promise
  }
};
