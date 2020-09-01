var mongoose = require("mongoose");
var Comment = require("./comment");
var User = require("./user");
var Category = require("./category");
var Subcategory = require("./subcategory");

var postSchema = new mongoose.Schema({
	name: String,
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	date: { type: Date, default: Date.now },
	body: String,
	category: String,
	subcategory: String,
	/*
	category: {id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category"
      }, name: String},
	subcategory: {id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Subcategory"
      }, name: String},
	  */
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

//var Post = mongoose.model("Post", postSchema);

module.exports = mongoose.model("Post", postSchema);