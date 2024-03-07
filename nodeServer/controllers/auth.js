const User = require("../models/user"); // this will import the user model
const nodemailer = require("nodemailer"); 
const sendgridTransport = require("nodemailer-sendgrid-transport");
const bcrypt = require("bcryptjs"); // this will import the bcryptjs package

module.exports = class ControllerAuth {
  

  static getLogin = (req, res) => {

    let message = req.flash("error"); // we receive error as array of strings

    if(message.length > 0){ //we check if error message exists
      message = message[0]; //if it does, we assign it to message
    }else{
      message = null; // else we use null, so it won't get displayed on the client
    }

    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: message,
    });
  };

  static postLogin = async (req, res, next) => {
    //Extract the user info from the request body
    const email = req.body.email;
    const password = req.body.password;

    try {
      const user = await User.findOne({ email: email }); // this will find the user by email

      //validate we found user
      if (!user) {
        await req.flash("error", "Invalid email or password");
        console.log("User not found");
        return res.redirect("/login");
      }

      //validate the password
      const doMatch = await bcrypt.compare(password, user.password); // this will compare the password

      //if the password is invalid, redirect to the login page
      if (!doMatch) {
        await req.flash("error", "Invalid email or password");
        console.log("Password not valid");
        return res.redirect("/login");
      }

      //set the session
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save(); // this will save the session to the database before we continue. use it in scenarios where we want to make sure session is saved before redirecting

      //redirect to the home page
      console.log("Logged in");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  };

  static postLogout = async (req, res, next) => {
    try {
      //session cookie on browser will still appear, but it will be invalid
      req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  };

  static postSignup = async (req, res, next) => {
    //retrieve the user info from the request body
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //validate user input
    //... code to validate user input

    try {
      //check if the user already exists
      const userExists = await User.findOne({ email: email });

      //if the user exists, redirect to the signup page
      if (userExists) {
        await req.flash("error", "This email is already being used");
        return res.redirect("/signup");
      }

      //create a new user
      console.log("Creating a new user");

      //hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name: "John",
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      //save the user to the database
      const result = await user.save();
      console.log(result);

      //redirect to the login page
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  };

  static getSignup = (req, res, next) => {

    let message = req.flash("error"); // we receive error as array of strings

    if(message.length > 0){ //we check if error message exists
      message = message[0]; //if it does, we assign it to message
    }else{
      message = null; // else we use null, so it won't get displayed on the client
    }

    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: message
    });
  };
};

// exports.getLogin = async (req, res, next) => {
//   try {
//     // const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1] === "true";
//     console.log(req.session.isLoggedIn);
//     res.render("auth/login", {
//       pageTitle: "Login",
//       path: "/login",
//       isAuthenticated: req.session.isLoggedIn,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.postLogin = async (req, res, next) => {
//   try {
//     //we set a cookie by simply setting a header
//     //res.setHeader("Set-Cookie", "loggedIn=true"); // value for cookie in its simpliest form is a key value pair
//     req.session.isLoggedIn = true;
//     // req.session.user = await UserActivation.findById(req.user._id); // this will find the user by id

//     //when sharing the user in a session, we shaare the user across requests
//     const dbUser = await User.findById("65dd22d54b0433f0aa1d3404"); // this will find the user by id
//     req.session.user = dbUser; // this will store the user in the request object
//     res.redirect("/");

//   } catch (err) {
//     console.log(err);
//   }
// };
