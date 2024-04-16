const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");



const app = express(); // this will create an express application


//routes
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");


//multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // this will store the file in the images folder
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname); // this will store the file with a unique name
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // this will accept the file
  }else{
    cb(null, false); // this will reject the file
  }
};



//public folder
app.use("/images", express.static(path.join(__dirname, "images"))); // this will allow access to the images folder

//middleware
//app.user(bodyParser.urlencoded({ extended: false })); // this will parse the body of the incoming request from forms in format x-www-form-urlencoded
app.use(bodyParser.json()); // this will parse the body of the incoming request
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")); // this will parse the file in the incoming request

app.use((req, res, next) => {
  //every response will have these headers
  //I can lock this dow to my specific frontend domain. multiple domains can be separated by commas
  res.setHeader("Access-Control-Allow-Origin", "*"); // this will allow access to any client from the server
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); // this will allow the methods that can be used
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // this will allow the headers that can be used
  next();
});

// routes
app.use("/feed", feedRoutes); // this will register the feedRoutes
app.use("/auth", authRoutes); // this will register the feedRoutes

app.use((error, req, res, next) => {
  // this will handle errors
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message }); // this will return the status and the message
});

mongoose
  .connect(
    "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/messages?retryWrites=true&w=majority", // this will connect to the database
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(8080); // this will start a server on port 3000
  })
  .catch((err) => {
    console.log(err);
  });
