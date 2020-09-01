var mongoose = require("mongoose");
var pass = require("passport-local-mongoose");
var Post = require("./post");
var Comment = require("./comment");
// Image as file in DB
/*var express = require('express');
var fs = require('fs')
//var imgPath = '/path/yourimage.png';

mongoose.connect('localhost', 'testing_storeImg');

var I = mongoose.model('I', userSchema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  I.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img
    var i = new I;
    i.img.data = fs.readFileSync(imgPath);
    i.img.contentType = 'image/png';
    i.save(function (err, i) {
      if (err) throw err;

      console.error('saved img to mongo');*/

var userSchema = new mongoose.Schema({
	username: String,
	//image: { data: Buffer, contentType: String },
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}],
	password: String,
});

userSchema.plugin(pass);

//var User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);