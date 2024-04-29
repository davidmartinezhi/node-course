const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // middleware do not deny the request, it just adds some data to the request object
    // on the resolver we decide if we want to continue or not

    const authHeader = req.get("Authorization");

    // Check if the Authorization header is set
    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    // Extract the token from the request header. we split to get value after 'Bearer'
    const token = req.get("Authorization").split(" ")[1];

    // Decode the token
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, "somesupersecretsecret"); //secret must be the same as the one used to sign the token
    }catch(err){
        req.isAuth = false;
        return next();
    }

    // If the token is undefined it didnt failed to decode, but failed to authenticate
    if(!decodedToken){
        req.isAuth = false; 
        return next();
    }

    // If the token is valid, we store the userId in the request object
    // This way we can use it in the next middlewares
    // We also set isAuth to true
    req.userId = decodedToken.userId;
    req.isAuth = true;

    next(); // this will pass the request to the next middleware
};