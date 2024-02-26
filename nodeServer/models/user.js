const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // this will store the user's cart
//     this._id = id; //  ? new mongodb.ObjectId(id) : null;
//   }

//   async save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);

//     // const db = getDb();
//     // let dbOp;

//     // try {

//     //   //check if we are editing an existing user
//     //   if(this._id){
//     //     dbOp = await db.collection("users").updateOne({ _id: this._id }, { $set: this }); // this will update the user
//     //     console.log("Updated User");
//     //     return dbOp;
//     //   }

//     //   //check if we are adding a new user
//     //   else{
//     //     dbOp = await db.collection("users").insertOne(this); // this will insert the user
//     //     console.log("Inserted User");
//     //     return dbOp;
//     //   }

//     // } catch (err) {
//     //   console.log(err);
//     // }
//   }

//   async addToCart(product) {
//     try {
//       // this will get us the index of the product in the cart
//       const cartProductIndex = this.cart.items.findIndex((cp) => {
//         // this will find the product in the cart
//         return cp.productId.toString() === product._id.toString(); // this will return true if the product exists in the cart
//       });

//       let newQuantity = 1; // this will store the new quantity of the product
//       const updatedCartItems = [...this.cart.items]; // this will store the updated cart items

//       //product already exists and we are going to update
//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1; // this will set the new quantity of the product
//         updatedCartItems[cartProductIndex].quantity = newQuantity; // this will update the quantity of the product
//       }

//       //creating a new product
//       else {
//         updatedCartItems.push({
//           productId: new ObjectId(product._id),
//           quantity: newQuantity,
//         }); // this will add the product to the cart
//       }

//       const updatedCart = { items: updatedCartItems }; // this will store the updated cart

//       const db = getDb(); // this will return the database object

//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: updatedCart } }
//         ); // this will update the user's cart
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getCart() {
//     try {
//       const db = getDb(); // this will return the database object
//       const productIds = this.cart.items.map((i) => i.productId); // this will store the product ids
//       const products = await db
//         .collection("products")
//         .find({ _id: { $in: productIds } })
//         .toArray(); // this will return the products in the cart
//       return products.map((p) => {
//         return {
//           ...p,
//           quantity: this.cart.items.find((i) => {
//             return i.productId.toString() === p._id.toString(); // this will return true if the product exists in the cart
//           }).quantity,
//         };
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async deleteItemFromCart(productId) {
//     try {
//       const updatedCartItems = this.cart.items.filter((item) => {
//         return item.productId.toString() !== productId.toString(); // this will return true if the is not the one we are deleting
//       });

//       const db = getDb(); // this will return the database object

//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: updatedCartItems } } }
//         ); // this will update the user's cart to have all cart items except the one deleted
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async addOrder() {
//     try {
//       const db = getDb(); // this will return the database object

//       //get current cart detailed info
//       const products = await this.getCart(); // this will get the products in the cart

//       const order = { // this will store the order
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.username,
//         }
//       };

//       await db.collection("orders").insertOne(order); // this will insert the order

//       this.cart = { items: [] }; // this will reset the cart. we clear cart on user object

//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         ); // this will reset the user's cart. we clear cart in database
//     } catch (error) {
//       console.log(error);
//     }
//   }

// async getOrders(){
//   const db = getDb();
//   return db.collection("orders").find({"user._id": new ObjectId(this._id)}).toArray(); // this will return the orders associated with the user
// }

//   static async findById(userId) {
//     const db = getDb();

//     return db.collection("users").findOne({ _id: new ObjectId(userId) });

//     // const db = getDb();

//     // try {
//     //   const user = await db
//     //   collection("users").findOne({_id : new mongodb.ObjectId(userId)});
//     //   console.log("Found User: " + user);
//     //   return user;
//     // } catch (err) {
//     //   console.log(err);
//     // }
//   }
// }

// module.exports = User;
// // ** USING SQL ORM: SEQUELIZE **
// // const Sequelize = require("sequelize"); // this will import the sequelize package

// // const sequelize = require("../util/database"); // this will import the sequelize instance

// // // this will create a new model
// // const User = sequelize.define("user", {
// //   id: {
// //     type: Sequelize.INTEGER, // this will create an integer column
// //     autoIncrement: true, // this will auto increment the id
// //     allowNull: false, // this will not allow null values
// //     primaryKey: true, // this will set the id as the primary key
// //   },
// //   name: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   email: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   }
// // });

// // module.exports = User;
