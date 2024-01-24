const Sequelize = require("sequelize"); // this will import the sequelize package

const sequelize = require("../util/database"); // this will import the sequelize instance

// this will create a new model
const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER, // this will create an integer column
    autoIncrement: true, // this will auto increment the id
    allowNull: false, // this will not allow null values
    primaryKey: true, // this will set the id as the primary key
  },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;