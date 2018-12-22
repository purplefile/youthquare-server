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
        content : String,
        post_token : String,
    });

    let Comment = new mongoose.Schema({
        post_token:String,
        comment:{
            comment_title:String,
            comment_user_name:String,
            comment_date:String,
            comment_user_profile:String,
            comment_content:String,
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
