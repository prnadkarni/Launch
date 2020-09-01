var mongoose = require("mongoose");
var Post = require("./post");

var subcategorySchema = new mongoose.Schema({
	name: String,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}]
});

//var Subcategory = mongoose.model("subcategory", subcategorySchema);

module.exports = mongoose.model("Subcategory", subcategorySchema);