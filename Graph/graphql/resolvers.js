const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {

    createUser: async function({ userInput }, req) {
        // const email = args.userInput.email;
        const existingUser = await User.findOne({ email: userInput.email });

        if (existingUser) {
            const error = new Error("User exists already!");
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });
        const createdUser = await user.save();
        // ...createdUser._doc is a spread operator that copies all properties of createdUser._doc to a new object
        // it is used to remove the metadata from the object and only return the actual data
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }

};