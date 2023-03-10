const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { STATUS } = require("../Helper/Constant");

let postSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Body: {
    type: String,
  },
  Created_By: {
    type: String,
    required: true,
  },
  Status: {
    type: Number,
    required: true,
    default: STATUS.ACTIVE,
  },
  Geo_location: {
    type: Array,
    required: true,
  },
});

postSchema.set("timestamps", true);

const PostSchema = mongoose.models.User || mongoose.model("Post", postSchema);

module.exports = PostSchema;
