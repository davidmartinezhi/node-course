//const http = require('http'); //without express
const path = require("path"); // this is a core module

const express = require("express");
const bodyParser = require("body-parser"); // this is a package that allows us to parse the body of the request
//const expressHbs = require("express-handlebars");

//Controllers
const errorController = require("./controllers/error");

//Database
const sequelize = require("./util/database");

//Models
const Product = require("./models/product");
const User = require("./models/user");

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


app.use(async (req, res, next) => {
  // this will find the user with the given id
  await User.findByPk(1)
    .then(user => {
      req.user = user; // this will add a user property to the request object
      next(); // this allows the request to continue to the next middleware in line
    })
    .catch((err) => console.log(err));
});


//routes
app.use("/admin", adminRoutes); // this will register the adminRoutes middleware
app.use(shopRoutes);
app.use("/", errorController.get404);

//Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // this will add a userId column to the products table and delete all products associated with the user when the user is deleted
User.hasMany(Product); // this will add a userId column to the products table, its the same as the line above but the other way around

/*
This looks at all the models you defined
Its aware of your models and creates tables.
It syncs your models and the db information

npm start is what runs this, not incoming requests,
so checking the user can be a middleware function
*/
sequelize
  //.sync({ force: true }) // this will drop all tables and recreate them
  .sync()
  .then((result) => {
    return User.findByPk(1); // this will find the user with the given id
    //console.log(result);
  })
  .then((user) => {
    if (!user) {
      // if there is no user, then create one
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user; // if there is a user, then return it
  })
  .then((user) => {
    console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
