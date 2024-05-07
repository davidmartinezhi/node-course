//const http = require('http'); //without express
const fs = require("fs"); // this is a core module
const path = require("path"); // this is a core module
const https = require("https"); // this is a core module

const express = require("express");
const bodyParser = require("body-parser"); // this is a package that allows us to parse the body of the request
const mongoose = require("mongoose"); // this is a package that allows us to connect to the database
const session = require("express-session"); // this is a package that allows us to store the session in the database
const helmet = require("helmet"); // this is a package that allows us to secure the app by setting various http headers
const compression = require("compression"); // this is a package that allows us to compress the response
const morgan = require("morgan"); // this is a package that allows us to log the requests

//session object is passed to the function in order to store the session in the database
const mongoDBStore = require("connect-mongodb-session")(session); // this is a package that allows us to store the session in the database
const csrf = require("csurf"); //package to create cross site request forgery token so app only works on my views
const flash = require("connect-flash");
const multer = require("multer"); // this is a package that allows us to parse the body of the request
const env = require("dotenv").config();
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.7pba9hx.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

console.log(process.env.NODE_ENV); // this must be set in production to production so express can adjust to production settings

//Controllers
const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express(); // this initializes a new express object where the framwework stores and manages things for us
const store = new mongoDBStore({
  uri: uri, // this is the uri to the database
  collection: "sessions", // this is the name of the collection where the sessions will be stored
  //expires: 1000 * 60 * 60 * 24, // this will set the session to expire in 24 hours
});

const csrfProtection = csrf("secret"); //we can add object to configure it

// const privatekey = fs.readFileSync("server.key"); // this will read the private key
// const certificate = fs.readFileSync("server.cert"); // this will read the certificate

//consiguration for multer
const fileStorage = multer.diskStorage({
  //with this we can configure where the file will be stored and the file name
  destination: (req, file, cb) => {
    cb(null, "images"); // this will set the destination of the file, null is the error message (it tells multer that everything is ok)
  }, // this will set the destination of the file
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname); // this will set the name of the file
  },
});

const fileFilter = (req, file, cb) => {
  //this will filter the files that we want to accept
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // this will accept the file
  } else {
    cb(null, false); // this will reject the file
  }
};

app.set("view engine", "ejs");
app.set("views", "views"); // this allows us to set any value globally that express will manage for us

//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" } // this will append the log to the file
// );

app.use(helmet()); // this will set various http headers to secure the app
app.use(compression()); // this will compress the response
//app.use(morgan("combined", {stream: accessLogStream})); // this will log the requests

// serving static files
app.use(express.static(path.join(__dirname, "public"))); // this allows us to serve static files like css files
app.use("/images", express.static(path.join(__dirname, "images"))); // this allows us to serve static images

//urlencoded is a function that returns a middleware function
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // this will parse the body of the request and store the image in the images folder
// app.use(cookieParser("cookie-parser-secret"));

app.use(
  session({
    secret: "mysecret", // this is a secret key that will be used to sign in the hash
    resave: false, // this will only save the session if the session has been modified
    saveUninitialized: false, // this will only save the session if the session has been modified
    store: store, // this will store the session in the database, this is how sessions should be stored for production
    //cookie: {maxAge: 1000 * 60 * 60 * 24} // this will set the cookie to expire in 24 hours
  })
);
// app.use(csurf("123456789iamasecret987654321look"));
app.use(csrfProtection); // this will register the csfr protection middleware
app.use(flash()); // this will register the flash-connect middleware

app.use((req, res, next) => {
  //this allows for local variables that are casted into the views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken(); //for every request that is executed, this 2 fields are set
  next(); //we continue
});

app.use(async (req, res, next) => {
  //validate if user is not logged in
  if (!req.session.user) {
    return next(); // we continue
  }

  try {
    //if user is logged in, we fetch the user from the database
    const user = await User.findById(req.session.user._id);

    //validate if user does not exist in database
    if (!user) {
      return next(); // we continue
    }

    req.user = user; // this will store the user in the request object;
    next(); // we continue
  } catch (err) {
    //this error could be a database error
    next(new Error(err)); // this will skip all the other middlewares ang go to the error handling middleware
  }
});

//routes
app.use("/admin", adminRoutes); // this will register the adminRoutes middleware
app.use(shopRoutes); // this will register the shopRoutes middleware
app.use(authRoutes); // this will register the authRoutes middleware
app.get("/500", errorController.get500); // this will register the errorController middleware
app.use("/", errorController.get404); // this will register the errorController middleware

//this is a centralized error handling middleware
app.use((error, req, res, next) => {
  //error handling middlewares are always read from top to bottom, when we declare various
  // res.redirect("/500"); //this is for redirecting to the error page as fallback
  // res.status(error.httpStatusCode).render(...);
  res.status(500).render("500", {
    pageTitle: "An Error Ocurred!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // https // this will create a server with the private key and the certificate
    //   .createServer({ key: privatekey, cert: certificate }, app) // this will create a server with the private key and the certificate
    //   .listen(process.env.PORT || 3000); // this will start the server on port 3000
    app.listen(process.env.PORT || 3000); // this will start the server on port 3000
  })
  .catch((err) => {
    console.log(err);
  });

// Connection only with mongoDB, no mongoose
// mongoConnect(() => {
//     app.listen(3000, () => console.log("Server is running on port 3000"));
// });

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
