var express = require("express");
var router  = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var Category = require("../models/category");
var Subcategory = require("../models/subcategory");
var User = require("../models/user");
var middleware = require("../middleware/index");
var flash = require('connect-flash')

//GET Request
router.get('/',function(req,res){
	//if no search matches
	var noMatch = null;
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Post.find({name: regex}, function(err, posts){
			if(err) {
				console.log(err);
			} else {
				Category.find({}, function(err, categories){
					if(err) {
						console.log(err);
					} else {
						if(posts.length < 1) {
						var noMatch = "No posts match your search; please try again!";
						}
						res.render("forums", {posts: posts, categories: categories, noMatch: noMatch});
					}
				});
			}
		});
	} else {
		Post.find({}, function(err, posts){
			if(err) {
				console.log(err);
			} else {
				Category.find({}, function(err, categories){
					if(err) {
						console.log(err);
					} else {
						res.render("forums", {posts: posts, categories: categories, noMatch: noMatch});
					}
				});
			}
		});
	}
});


router.post('/', function(req, res){
	var name = req.body.name;
    var date = new Date();
    var body = req.body.body;
	Category.findById(req.body.category, function(err, foundCategory){
		if(err){
			console.log(err);
		} else {
			var category = foundCategory.name;
			Subcategory.findById(req.body.subcategory, function(err, foundSubcategory){
				if(err){
					console.log(err);
				} else {
					var subcategory = foundSubcategory.name;
					var author = {id: req.user._id, username: req.user.username};
					var comments = [];
					var new_post = {name: name, author: author, date: date, body: body, category: category, subcategory: subcategory, comments: comments};
					/*if (new_post.length < 6) {
						req.flash("error", "Please fill out all fields.");
						//console.log(err);
						res.redirect("back");
					 else {*/
						Post.create(new_post, function(err, newPost){
							User.findById(req.user._id, function(err, user){
								if(err){
									console.log(err);
								} else {
									user.posts.push(newPost);
									user.save();
								}
							});

							Category.findById(req.body.category, function(err, cat){
								if(err){
									console.log(err);
								} else {
									cat.posts.push(newPost);
									cat.save();
								}
							});

							Subcategory.findById(req.body.subcategory, function(err, sub){
								if(err){
									console.log(err);
								} else {
									sub.posts.push(newPost);
									sub.save();
								}
							});
							req.flash("success","Successfully Posted!");
							res.redirect("/forums");
						});
					//}
				}
			});
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req,res){
	Category.find({}, function(err, category){
		if(err) {
			console.log(err);
		} else {
			Subcategory.find({}, function(err, subcategory){
				if(err) {
					console.log(err);
				} else {
					res.render("createpost", {category: category, subcategory: subcategory});
				}
			});
		}
	});
});

router.get("/categories",function(req,res){
	//if no search matches
	var noMatch = null;
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Category.find({name: regex}, function(err, categories){
			if(err) {
				console.log(err);
			} else {
				if(categories.length < 1) {
				var noMatch = "No categories match your search; please try again!";
				}
				res.render("categories", {categories: categories, noMatch: noMatch});
			}
		});
	} else {
		Category.find({}, function(err, categories){
			if(err) {
				console.log(err);
			} else {
				res.render("categories", {categories: categories, noMatch: noMatch});
			}
		});
	}
});

router.get('/categories/:categoryID',function(req,res){
	//if no search matches
	var noMatch = null;
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Category.findById(req.params.categoryID).populate("subcategories").exec(function(err, foundCategory){
			if(err) {
				console.log(err);
				res.redirect("/forums");	
			} else {
				Post.find({category: foundCategory.name, name: regex}, function(err, foundPosts){
					if(foundPosts.length < 1) {
						var noMatch = "No posts match your search; please try again!";
					}
					res.render("categoryhome", {posts: foundPosts, category: foundCategory, noMatch: noMatch});
				});
			}
		});
	} else {
		Category.findById(req.params.categoryID).populate("subcategories").exec(function(err, foundCategory){
			if(err) {
				console.log(err);
				res.redirect("/forums");	
			} else {
				Post.find({category: foundCategory.name}, function(err, foundPosts){
					res.render("categoryhome", {posts: foundPosts, category: foundCategory, noMatch: noMatch});
				});
			}
		});
	}
});

router.get('/categories/:categoryID/:subcategoryID',function(req,res){
	var noMatch = null;
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Category.findById(req.params.categoryID, function(err, foundCategory){
			if(err) {
				res.redirect("/forums");	
			} else {
				Subcategory.findById(req.params.subcategoryID, function(err, foundSubcategory){
					if(err) {
						res.redirect("/forums");	
					} else {
						Post.find({subcategory: foundSubcategory.name, name: regex}, function(err, foundPosts){
							if(foundPosts.length < 1) {
								var noMatch = "No posts match your search; please try again!";
							}
							res.render("subcategoryhome", {posts: foundPosts, category: foundCategory, subcategory: foundSubcategory, noMatch: noMatch});
						});
					}
				});
			}
		});
	} else {
		Category.findById(req.params.categoryID, function(err, foundCategory){
			if(err) {
				res.redirect("/forums");	
			} else {
				Subcategory.findById(req.params.subcategoryID, function(err, foundSubcategory){
					if(err) {
						res.redirect("/forums");	
					} else {
						Post.find({subcategory: foundSubcategory.name}, function(err, foundPosts){
							res.render("subcategoryhome", {posts: foundPosts, category: foundCategory, subcategory: foundSubcategory, noMatch: noMatch});
						});
					}
				});
			}
		});
	}
});

//NOT SURE HOW TO GET POST ID INTO COMMENT DATA

/*
router.post('/:postID', middleware.isLoggedIn, function(req, res){
	Post.findById(req.params.postID, function(err, post){
		if(err) {
			console.log(err);
			res.redirect("/forums/:postID");
		} else {
			Comment.create(req.body.comment, function(err, newComment){
				if(err){
					res.render("createcomment");
				} else {
					User.findById(req.user._id, function(err, user){
						if(err){
							console.log(err);
						} else {
							user.comments.push(newComment);
							user.save();
						}
					});
					post.comments.push(newComment);
					post.save();
					res.redirect("/forums/" + post._id);
				}
			});
		}		
	});
});
*/
router.get('/:postID',function(req,res){
	
	console.log("(A) get being called: " + req.params.postID + " " + req.originalUrl + " the big one: ");
	
	console.log(req.route);
	console.log(req.params);
	
	Post.findById(req.params.postID).populate("comments").exec(function(err, foundPost){
		if(err) {
			console.log("Help..")
			res.redirect("/forums");	
		} else {
			//if (!foundPost) {
				//console.log("(B) failed to find post");
			//} else {
				console.log("post found: " + foundPost);
				res.render("postpage", {post: foundPost});	
			//}	
		}
	});
});

router.delete("/:postID", middleware.checkPostOwnership, function(req, res){
	console.log("delete executes");
	Post.findByIdAndRemove(req.params.postID, function(err){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			res.redirect("/forums");
		} else {
            req.flash("error", "Post deleted!");
			res.redirect("/forums");
		}
	});
});

//editing
router.get("/:postID/edit", middleware.checkPostOwnership, function(req, res){
	Post.findById(req.params.postID, function(err, foundPost){
		if(err){
			res.redirect("/forums/" + post._id);
		} else {
			Category.find({}, function(err, category){
				if(err) {
					console.log(err);
				} else {
					Subcategory.find({}, function(err, subcategory){
						if(err) {
							console.log(err);
						} else {
							res.render("editpost", {post: foundPost, categories: category, subcategories: subcategory, category: category, subcategory: subcategory});
						}
					});
				}
			});
		}
	});
});

router.put("/:postID", middleware.checkPostOwnership, function(req, res){
	Category.findById(req.body.category, function(err, foundCategory){
		if(err){
			console.log(err);
		} else {
			var category = foundCategory.name;
			Subcategory.findById(req.body.subcategory, function(err, foundSubcategory){
				if(err){
					console.log(err);
				} else {
					var name = req.body.name;
					var date = new Date();
					var body = req.body.body;
					var subcategory = foundSubcategory.name;
					var author = {id: req.user._id, username: req.user.username};
					var updated_post = {name: name, author: author, date: date, body: body, category: category, subcategory: subcategory};
					if (updated_post.includes('')) {
						req.flash("error", err.message);
						console.log(err);
						res.redirect("/forums");
					} else {
						Post.findByIdAndUpdate(req.params.postID, updated_post, function(err, newPost){
							if(err) {
								req.flash("error", err.message);
								console.log(err);
								res.redirect("back");
							} else {
								req.flash("success","Successfully Edited!");
								res.redirect("/forums/" + req.params.postID);
							}
						});
					}
				}
			});
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;