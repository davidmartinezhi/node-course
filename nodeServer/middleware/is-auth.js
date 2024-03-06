module.exports = (req, res, next) => {
  //check if user is not on a valid session
  if(!req.session.isLoggedIn){
    return res.redirect("/login");
  }

  //if user is in a valid session, we proceed
  next();
}