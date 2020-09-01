var mongoose = require("mongoose");
var Post = require("./post");
var User = require("./user");

var commentSchema = new mongoose.Schema({
	body: String,
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	date: Date
});

module.exports = mongoose.model("Comment", commentSchema);