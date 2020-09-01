var mongoose = require("mongoose");
var Post = require("./post");
var Comment = require("./comment");
var Subcategory = require("./subcategory");

var categorySchema = new mongoose.Schema({
	name: String,
	subcategories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subcategory"
	}],
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}]
});

//var Category = mongoose.model("Category", categorySchema);

module.exports = mongoose.model("Category", categorySchema);