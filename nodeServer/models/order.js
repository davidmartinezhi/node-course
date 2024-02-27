const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    //products is an array of objects
    products: [
        { //this is an object

            //product
            product: { 
                type: Object,
                required: true
            },
            //quantity of product
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    // The user object
    user: {

        //name of the user
        name: {
            type: String,
            required: true
        },

        //user id
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
});

//export the model
exports.Order = mongoose.model("Order", orderSchema);