var express = require("express");
var router = express.Router();
var Post = require("./models/post");
var Category = require("./models/category");
var Subcategory = require("./models/subcategory");
var User = require("./models/user");
var Comment = require("./models/comment");

router.get('/search', function(req, res, next){
	var q = req.query.q
	Post.find([
		Post.name: {
		$regex: new RegExp(q)
		}
	}, {
		_id: 0,
		_v: 0
	}, function(err, data) {
		res.json(data);
		}).limit(10);
	])

module.exports = router;