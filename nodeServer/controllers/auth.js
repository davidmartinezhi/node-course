exports.getLogin = async (req, res, next) => {
  try {
    const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1] === "true";
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    //we set a cookie by simply setting a header
    res.setHeader("Set-Cookie", "loggedIn=true"); // value for cookie in its simpliest form is a key value pair
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
