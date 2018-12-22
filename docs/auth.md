# POST /auth/login

## Request

> uid : String

## Response : Success

> status : 200

> data : user Data (유저 스키마 참조)

## Response : Fail

> status : 404

> message : User Not Found

# Post /auth/register

## Request

> uid : String

> profile_img : String

> email : String

> name : String

> age : String

## Response : Success

> status : 200

> data:{

>   uid:String,

>   email:String,

>   name:String,

>   age:Number ,

>   profile_img : Stri g

>}

## Response : Fail

> status:403,

> message:"Already Exist"