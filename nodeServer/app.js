//const http = require('http'); //without express
const path = require("path"); // this is a core module

const express = require("express");
const bodyParser = require("body-parser"); // this is a package that allows us to parse the body of the request
//const expressHbs = require("express-handlebars");

//Controllers
const errorController = require("./controllers/error");

//Database
const mongoConnect = require("./util/database").mongoConnect;

/* SEQUELIZE CODE */
// //Models
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express(); // this initializes a new express object where the framwework stores and manages things for us

//pug template engine
//app.set("view engine", "pug"); // this allows us to set any value globally that express will manage for us

//express-handlebars template engine
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
app.set("view engine", "ejs");
app.set("views", "views"); // this allows us to set any value globally that express will manage for us

//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// serving static files
app.use(express.static(path.join(__dirname, "public"))); // this allows us to serve static files like css files

// this is a function that allows us to add a new middleware function
//Allows us to use array of middleware functions
//Whatrever we add will be used for every incoming request
// app.use((req, res, next) => {
//     console.log('In the middleware!');
//     next(); // this allows the request to continue to the next middleware in line
// }); // next is a function that will be passed to the middleware function by express));

// Middleware functions are executed in the order they are defined

//urlencoded is a function that returns a middleware function
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use("/admin", adminRoutes); // this will register the adminRoutes middleware
app.use(shopRoutes);
app.use("/", errorController.get404);

mongoConnect(() => {
    app.listen(3000, () => console.log("Server is running on port 3000"));
});

/* SEQUELIZE CODE */
// //Associations
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // this will add a userId column to the products table and delete all products associated with the user when the user is deleted
// User.hasMany(Product); // this will add a userId column to the products table, its the same as the line above but the other way around

// User.hasOne(Cart); // this will add a cartId column to the users table
// Cart.belongsTo(User); // this will add a userId column to the carts table

// Cart.belongsToMany(Product, { through: CartItem }); // this will add a cartId column and a productId column to the cartItems table
// Product.belongsToMany(Cart, { through: CartItem }); // this will add a cartId column and a productId column to the cartItems table

// Order.belongsTo(User); // this will add a userId column to the orders table
// User.hasMany(Order); // this will add a userId column to the orders table

// Order.belongsToMany(Product, { through: OrderItem }); // this will add a orderId column and a productId column to the orderItems table

// /*
// This looks at all the models you defined
// Its aware of your models and creates tables.
// It syncs your models and the db information

// npm start is what runs this, not incoming requests,
// so checking the user can be a middleware function
// */

// const startServer = async () => {
//     try {
//       await sequelize.sync();
//       let user = await User.findByPk(1);

//       if (!user) {
//         user = await User.create({ name: 'Max', email: 'test@test.com' });
//       }

//       let cart = await user.getCart();
//       if (!cart) {
//         cart = await user.createCart();
//       }

//       app.listen(3000, () => console.log('Server is running on port 3000'));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   startServer();
