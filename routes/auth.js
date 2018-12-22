
module.exports = auth;

let { User } = require('../DB/Schema');
let random_string = require('randomstring');
let Logger = require('../func/color').Logger; 

function auth(app){
    app.post('/auth/login',(req,res)=>{
        let uid = req.body.uid;
        let email = req.body.email;
	console.log(uid);
        User.find({uid:uid},(err,model)=>{
            if(err) throw err;
console.log(model, model.length, model.length == 0);
            if(model.length == 0){
                res.send({
                    status:404,
                    message:'User Not Found'
                })
            }   
            else{
                res.send({
                    status:200,
                    data:model[0]
                })
            }
        });
    });

    app.post('/auth/register',(req,res)=>{
        let uid = req.body.uid;
        let email = req.body.email;
        let name = req.body.name;
        let age = req.body.age;
        let post_array = new Array();

        User.find({uid:uid},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                let saveUser = new User({
                    uid:uid,
                    email:email,
                    post_list:post_array,
                    name:name,
                    age:age,
                });
        
                saveUser.save((err,model)=>{
                    if(err) throw err;
                    res.send({
                        status:200,
                        data:{
                            uid:uid,
                            email:email,
                            name:name,
                            age:age
                        }
                    });
                });
            }
            else{
                res.send({
                    status:403,
                    message:"Already Exist"
                })
            }
        });
    });
}
