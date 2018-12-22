module.exports = post;

let { Post , User , Comment } = require('../DB/Schema');
let async = require('async');
let random_string = require('randomstring');

function post(app){
    app.get('/post',(req,res)=>{
        Post.find({},(err,model)=>{
            if(err) throw err;
            res.send({
                status:200,
                data:model
            });
        });
    });

    app.post('/post/add/argument',(req,res)=>{
        let post_token = req.body.post_token;
        let uid = req.body.uid;
        let comment_title = req.body.comment_title;
        let comment_date = new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate();
        let comment_content = req.body.comment_content;
        let comment_link = req.body.link

         async.waterfall([
             function(cb){
                 Post.find({post_token : post_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Post Not Found');
                    }
                    else{
                        cb(null);
                    }
                 });
             },
             function(cb){
                 User.find({uid:uid},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 403 , "User Not Found");
                    }
                    else{
                        cb(null , model[0]);
                    }
                 });
             },
             function(user , cb){
                 let saveComment = new Comment({
                     post_token:post_token,
                     comment:{
                         comment_title:comment_title,
                         comment_content:comment_content,
                         comment_date:comment_date,
                         comment_user_profile:user.profile_img,
                         comment_user_name:user.name,
                         comment_like:0,
                         comment_dislike:0,
                         comment_link:comment_link,
                         comment_token:random_string.generate(),
                         reply:new Array()
                     }
                 });

                 saveComment.save((err,model)=>{
                    if(err) throw err;
                    cb(true , 200 , "Save Success");
                 });
             }
         ],function(cb , status , message){
            if(cb == true || cb == null){
                res.send({
                    status:status,
                    message:message
                });
            }
         });
    });

    app.get('/post/get/argument/:post_token',(req,res)=>{
        let post_token = req.params.post_token;
        console.log(post_token);

        Comment.find({post_token:post_token},(err,model)=>{
            if(err) throw err;
            res.send({
                status:200,
                data:model
            })
        });
    });

    app.post('/post/argument/like',(req,res)=>{
        let post_token = req.body.post_token;
        let comment_token = req.body.comment_token;

        console.log(comment_token)

        async.waterfall([
            function(cb){
                Post.find({post_token:post_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Post Not Found');
                    }
                    else{
                        cb(null);
                    }
                });
            },
            function(cb){
                Comment.find({'comment.comment_token':comment_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Comment Not Found');
                    }
                    else{
                        cb(null , model[0].comment.comment_like);
                    }
                });
            },
            function(like , cb){
                Comment.update({'comment.comment_token':comment_token},{$set:{'comment.comment_like':(like + 1)}},(err,model)=>{
                    if(err) throw err;
                    cb(null , 200 , 'update success');
                });
            }
        ],function(cb , status , message){
            if(cb == null || cb == true){
                res.send({
                    status:status,
                    message:message
                });
            }
        });
    });

    app.post('/post/argument/dislike',(req,res)=>{
        let post_token = req.body.post_token;
        let comment_token = req.body.comment_token;
        
        async.waterfall([
            function(cb){
                Post.find({post_token:post_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Post Not Found');
                    }
                    else{
                        cb(null);
                    }
                });
            },
            function(cb){
                Comment.find({'comment.comment_token':comment_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Comment Not Found');
                    }
                    else{
                        cb(null , model[0].comment.comment_dislike);
                    }
                });
            },
            function(dislike , cb){
                Comment.update({'comment.comment_token':comment_token},{$set:{'comment.comment_dislike':(dislike + 1)}},(err,model)=>{
                    if(err) throw err;
                    cb(null , 200 , 'update success');
                });
            }
        ],function(cb , status , message){
            if(cb == null || cb == true){
                res.send({
                    status:status,
                    message:message
                });
            }
        });
    });

    app.post('/post/add/relay/comment',(req,res)=>{
        let comment_token = req.body.comment_token;
        let uid = req.body.uid;
        let reply_comment = req.body.reply_comment;
        let post_token;
        let user_post_array;

        async.waterfall([
            function(cb){
                Comment.find({'comment.comment_token':comment_token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , 'Comment Not Found');
                    }
                    else{
                        post_token = model[0].post_token
                        cb(null , model[0]);
                    }
                });
            },
            function(comment , cb){
                User.find({uid:uid},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        cb(true , 404 , "User Not Found");
                    }
                    else{
                        user_post_array = model[0].post_list
                        cb(null , model[0] , comment);
                    }
                });
            },
            function(user , comment , cb){
                
                let reply = comment.comment.reply[comment.comment.reply.length] = {
                    profile_img:user.profile_img,
                    name:user.name,
                    reply_comment:reply_comment
                }
                Comment.update({'comment.comment_token':comment_token},{$set:{'comment.reply':reply}},(err,model)=>{
                    if(err) throw err;
                    cb(null)
                });
            },
            function(cb){
                user_post_array[user_post_array.length] = post_token;
                User.update({uid:uid},{$set:{post_list:user_post_array}},(err,model)=>{
                    if(err) throw err;
                    cb(null , 200 ,'Save Success')
                });
            }
        ],function(cb , status , message){
            if(cb == true || cb == null){
                res.send({
                    status:status,
                    message:message
                })
            }
        })
    });

    app.get("/post/get/reply/:comment_token",(req,res)=>{
        let comment_token = req.params.comment_token;

        Comment.find({'comment.comment_token':comment_token},(err,model)=>{
            if(err) throw err;
            res.send({
                status:200,
                data:model
            });
        });
    });
}