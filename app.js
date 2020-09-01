var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var pass = require("passport-local-mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var Post = require("./models/post");
var Category = require("./models/category");
var Subcategory = require("./models/subcategory");
var User = require("./models/user");
var Comment = require("./models/comment");

mongoose.connect("mongodb://localhost:27017/jobs_site", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//ROUTES IMPORTS
var commentRoutes = require("./routes/comments"),
	postRoutes = require("./routes/posts"),
	authRoutes      = require("./routes/index");


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "passport works",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
   	res.locals.success = req.flash("success");
   	next();
});
/*
var seed = {name: "Engineering", posts: [], subcategories: []};
Category.create(seed, function(err, category){
	if(err){
		console.log(err)
	} else {
		console.log("added a category");
		//create a comment
		Subcategory.create(
			{
				name: "Computer Science",
				posts: []
			}, function(err, subcategory){
				if(err){
					console.log(err);
				} else {
					category.subcategories.push(subcategory);
					category.save();
					console.log("Created new subcategory");
				}
			});
	}
});

*/
console.log('Running at Port 3000');

app.use("/", authRoutes);
app.use("/forums", postRoutes);
app.use("/forums/:postID/comment", commentRoutes);

/*
app.get("*",function(req,res){
  res.redirect("/");
});
*/
app.listen(process.env.port || 3000, process.env.IP, ()	=> {
	console.log("listening on Port 3000");
});