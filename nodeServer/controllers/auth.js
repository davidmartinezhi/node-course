const User = require("../models/user"); // this will import the user model
const crypto = require("crypto"); // this will import the crypto package, it helps build secure random values
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const bcrypt = require("bcryptjs"); // this will import the bcryptjs package
const { validationResult } = require("express-validator"); //this gathers all errors from the validation middleware

const env = require("dotenv").config();
const USER = env.parsed.USER;
const EMAIL = env.parsed.EMAIL;
const PASSWORD = env.parsed.PASSWORD;

//we execute sendgridTransport as a function because it returns a configuration that nodemailer can use to use sendgrid
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: USER, // generated mailtrap user
    pass: PASSWORD, // generated mailtrap password
  },
});

module.exports = class ControllerAuth {
  static getLogin = (req, res) => {
    let message = req.flash("error"); // we receive error as array of strings

    if (message.length > 0) {
      //we check if error message exists
      message = message[0]; //if it does, we assign it to message
    } else {
      message = null; // else we use null, so it won't get displayed on the client
    }

    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: message,
      oldInput: {
        email: "",
      },
      validationsErrors: [],
    });
  };

  static postLogin = async (req, res, next) => {
    //Extract the user info from the request body
    const email = req.body.email;
    // const password = req.body.password;

    const errors = validationResult(req); // this will extract the validation errors
    console.log(errors.array());

    //validate the user input
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        validationsErrors: errors.array(),
        oldInput: {
          email: req.body.email,
        },
      });
    }

    try {
      const user = await User.findOne({ email: email }); // this will find the user by email

      // //validate we found user
      // if (!user) {
      //   await req.flash("error", "Invalid email or password");
      //   console.log("User not found");
      //   return res.redirect("/login");
      // }

      // //validate the password
      // const doMatch = await bcrypt.compare(password, user.password); // this will compare the password

      // //if the password is invalid, redirect to the login page
      // if (!doMatch) {
      //   await req.flash("error", "Invalid email or password");
      //   console.log("Password not valid");
      //   return res.redirect("/login");
      // }

      //set the session

      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save(); // this will save the session to the database before we continue. use it in scenarios where we want to make sure session is saved before redirecting

      //redirect to the home page
      console.log("Logged in");
      res.redirect("/");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
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
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    }
  };

  static postSignup = async (req, res, next) => {
    //retrieve the user info from the request body
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req); // this will extract the validation errors

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword,
        },
        validationsErrors: errors.array(),
      });
    }

    //validate user input
    //... code to validate user input

    try {
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
      console.log("User created");

      // send mail
      await transporter.sendMail({
        to: email,
        from: EMAIL,
        subject: "Signup succeeded",
        html: "<h1>You succeesfully signed up!</h1>",
      });
      console.log("email sent");

      //redirect to the login page
      res.redirect("/login");
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    }
  };

  static getSignup = (req, res, next) => {
    let message = req.flash("error"); // we receive error as array of strings

    if (message.length > 0) {
      //we check if error message exists
      message = message[0]; //if it does, we assign it to message
    } else {
      message = null; // else we use null, so it won't get displayed on the client
    }

    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: message,
      oldInput: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationsErrors: [],
    });
  };

  static getReset = (req, res, next) => {
    let message = req.flash("error"); // we receive error as array of strings

    if (message.length > 0) {
      //we check if error message exists
      message = message[0]; //if it does, we assign it to message
    } else {
      message = null; // else we use null, so it won't get displayed on the client
    }

    res.render("auth/reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      errorMessage: message,
    });
  };

  static postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }

      const token = buffer.toString("hex"); // this will convert the buffer to a string, buffer contains hex values

      User.findOne({ email: req.body.email })
        .then((user) => {
          if (!user) {
            req.flash("error", "No account with that email found");
            res.redirect("/reset");
          }

          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000; // this will set the expiration to 1 hour from now
          return user.save();
        })
        .then((result) => {
          res.redirect("/"); // this will redirect to the home page

          // send mail
          transporter.sendMail({
            to: req.body.email,
            from: "shop@node-course.com",
            subject: "Password reset",
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
      
          // this will skip all the other middlewares ang go to the error handling middleware
          return next(error); 
        });
    });
  };

  static getNewPassword = (req, res, next) => {
    const token = req.params.token; // this will get the token from the url
    console.log(token);

    // this will find the user by token and expiration date
    User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    }).then((user) => {
      let message = req.flash("error"); // we receive error as array of strings

      if (message.length > 0) {
        //we check if error message exists
        message = message[0]; //if it does, we assign it to message
      } else {
        message = null; // else we use null, so it won't get displayed on the client
      }
      console.log("token: " + token);
      res.render("auth/new-password", {
        // this will render the new-password page
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    });
  };

  static postNewPassword = (req, res, next) => {
    const newPassword = req.body.password; // this will get the new password
    const userId = req.body.userId; // this will get the user id
    const token = req.body.passwordToken; // this will get the token
    console.log("00000000");
    console.log(newPassword);
    console.log(userId);
    console.log(token);

    let resetUser;
    console.log(userId);

    // this will find the user by id and token
    User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        console.log(user);
        resetUser = user; // this will store the user in the resetUser variable
        return bcrypt.hash(newPassword, 12); // this will hash the new password
      })
      .then((hashedPassword) => {
        console.log(hashedPassword);
        resetUser.password = hashedPassword; // this will set the new password
        resetUser.resetToken = undefined; // this will set the reset token to undefined
        resetUser.resetTokenExpiration = undefined; // this will set the reset token expiration to undefined
        return resetUser.save(); // this will save the user
      })
      .then((result) => {
        console.log("Password updated");
        res.redirect("/login"); // this will redirect to the login page
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
    
        // this will skip all the other middlewares ang go to the error handling middleware
        return next(error); 
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
