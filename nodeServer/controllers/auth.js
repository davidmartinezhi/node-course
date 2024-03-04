const User = require("../models/user"); // this will import the user model

module.exports = class ControllerAuth {
  static getLogin(req, res) {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: req.session.isLoggedIn,
    });
  }

  static postLogin = async (req, res, next) => {
    try {
      const user = await User.findById("65dd22d54b0433f0aa1d3404");
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      }); // this will save the session to the database before we continue. use it in scenarios where we want to make sure session is saved before redirecting
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
