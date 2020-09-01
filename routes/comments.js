var express = require("express");
var router  = express.Router({mergeParams:true});
var Post = require("../models/post");
var Comment = require("../models/comment");
var Category = require("../models/category");
var Subcategory = require("../models/subcategory");
var User = require("../models/user");
var middleware = require("../middleware/index");

//Create Comment
router.get('/new', middleware.isLoggedIn, function(req, res){
	//find post w id
	console.log(req.params.id);
	Post.findById(req.params.postID, function(err, post){
		if(err) {
			console.log(err);
		} else {
			res.render("createcomment", {post: post});
		}		
	});
});

//Post Comment
router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
	console.log("comment was called at all");
   Post.findById(req.params.postID, function(err, post){
       if(err){
           console.log(err);
           res.redirect("/forums");
       } else {
		var author = {id: req.user._id, username: req.user.username};
		var date = new Date();
		console.log("Date: " + date + " Author: " + author);
		var body = req.body.body; 
		var new_comment = {author: author, date: date, body: body};
		console.log("Comm: " + new_comment);
        Comment.create(new_comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               post.comments.push(comment);
               post.save();			   
			   User.findById(req.user._id, function(err, user){
					if(err){
						console.log(err);
					} else {
						user.comments.push(post);
						user.save();
					}
				});			
               
               res.redirect("/forums/" + post._id);
           }
        });
       }
   });
});

//EDIT
router.put("/:commentID", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentID, {body: req.body.body, date: new Date()}, function(err, updatedComment){
		if(err) {
			console.log(err);
			res.redirect("/forums/" + req.params.postID);
		} else {
			res.redirect("/forums/" + req.params.postID);
		}
	});
});

router.delete("/:commentID", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentID, function(err){
		if(err){
			console.log(err);
			res.redirect("/forums/" + req.params.postID);
		} else {
			res.redirect("/forums/" + req.params.postID);
		}
	});
});

router.get("/:commentID/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.commentID, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("/forums/" + req.params.postID + "/" + req.params.commentID);
		} else {
			Post.findById(req.params.postID, function(err, foundPost){
				if(err){
					console.log(err);
					res.redirect("/forums/" + req.params.postID + "/" + req.params.commentID);
				} else {
					res.render("editcomment", {post: foundPost, comment: foundComment});
				}
			});
		}
	});
});

module.exports = router;