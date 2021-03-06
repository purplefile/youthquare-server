const mongoose = require('mongoose');
const Logger = require('../func/color').Logger;

mongoose.connect('mongodb://localhost:27017/appjam') ;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    Logger.data("Mongo DB ON");
});

let User = new mongoose.Schema({
    uid : String,
    email : String,
    name : String,
    age  : Number, 
    profile_img : String,
    post_list:Array,
});

let Post = new mongoose.Schema({
    img : String ,
    title : String,
    category : String,
    content : Array,
    post_token : String,
    url : String ,
});

let Comment = new mongoose.Schema({
    post_token:String,
    comment:{
        comment_title:String,
        comment_user_name:String,
        comment_date:String,
        comment_user_profile:String,
        comment_content:Array,
        comment_like : Number,
        comment_dislike : Number,
        comment_token : String,
        comment_link: Array,
        reply:[{
            profile_img : String,
            name : String ,
            reply_comment : String,
        }]
    }
});

let userModel = mongoose.model('userModel',User);
let postModel = mongoose.model('postModel',Post);
let commentModel = mongoose.model('commentModel',Comment);

exports.User = userModel
exports.Post = postModel
exports.Comment = commentModel