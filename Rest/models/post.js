const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true } // this will add a createdAt and updatedAt field to the schema
);

exports.Post = mongoose.model("Post", postSchema); // this will create a model called Post with the schema postSchema