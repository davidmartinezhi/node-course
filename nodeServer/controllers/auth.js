exports.getLogin= async (req, res, next) => {
    try {  
      res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
      });
    } catch (err) {
      console.log(err);
    }
  };