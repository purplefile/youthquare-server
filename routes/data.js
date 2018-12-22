module.exports = data;

let { User } = require('../DB/Schema');

function data(app){
    app.post('/data/user',(req,res)=>{
        let uid = req.body.uid;

        User.find({uid:uid},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send(401 , {message : 'User Not Found'});
            }
            else{
                res.send(200 , model[0])
            }
        });
    });
}