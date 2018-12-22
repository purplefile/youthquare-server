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
> email : String
> name : String
> age : String

## Response : Success

> status : 200
> data:{
>   uid:uid,
>   email:email,
>   name:name,
>   age:age
>}

## Response : Fail

> status:403,
> message:"Already Exist"