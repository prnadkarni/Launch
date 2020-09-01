var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Post = require("../models/post");
var Comment = require("../models/comment");
var Category = require("../models/category");
var Subcategory = require("../models/subcategory");
var middleware = require("../middleware/index");

//GET Request
router.get('/', function(req, res){
	Post.find({}, function(err, posts){
		if(err) {
			console.log(err);
		} else {
			res.render("home", {posts: posts});
		}
	});
});

//NONE
router.get('/about-us',function(req,res){
  res.render("aboutus");
});

//GET REQUESTS

router.get('/user/:profileID',function(req,res){
  User.findById(req.params.profileID).populate("comments").populate("posts").exec(function(err, foundUser){
		if(err) {
			res.redirect("/");	
		} else {
			res.render("user", {user: foundUser});
		}
	});
});

router.post('/user/:profileID',function(req,res){
  User.findByIdAndUpdate(req.params.profileID, {username: req.body.username}, function(err, foundUser){
		if(err) {
			res.redirect("/");	
		} else {
			res.render("user", {user: foundUser});
		}
	});
});

router.get('user/:profileID/edit', function(req,res){
	User.findById(req.params.profileID, function(err, foundUser){
		if(err) {
			res.redirect("/");	
		} else {
			res.render("edituser", {posts: foundUser.posts, comments: foundUser.comments});
		}
	});
});

//AUTH ROUTES
router.get("/sign-up", middleware.isNotLoggedIn, function(req,res){
	res.render("signup");	
});

router.post("/sign-up",function(req,res){
	var newUser = new User({username: req.body.username, posts: [], comments: []});
 	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			res.redirect("/sign-up");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Jobs Website " + user.username);
			res.redirect("/forums");
		});
	});
}); 

router.get("/log-in", middleware.isNotLoggedIn, function(req,res){
	res.render("login");
});


//router.post('/log-in', middleware, callback);
router.post("/log-in", passport.authenticate("local", 
	{successRedirect: "/forums", failureRedirect: "/log-in", failureFlash: "Incorrect username or password."}), function(req,res){
});

router.get("/log-out", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

module.exports = router;