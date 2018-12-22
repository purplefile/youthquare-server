# GET /post

## Request

> 요청하는 데이터가 없습니다

## Response : Success

> status : 200

> data : Post model 참조

# POST /post/add/argument

## Request

> post_token : String

> uid : String

> comment_tile : String

> comment_content : String

> link : Array

## Response : Success

> status : 200

> message : Save Success 

## Response : Fail

> status : 403

> message: User Not Found

## Response : Fail

> status : 404

> message : Post Not Found

# /GET /post/get/argument/:post_token

## Request

> post_token : String

## Response

> status : 200

> data : post model 참조

# /POST /post/argument/like

## Request

> post_token : String

> comment_token : String

## Response : Success

> status : 200

> message : Save Success

## Response : Fail

> status : 404

> message : Comment not Found

## Response : Fail

> status : 404

> message : Post not Found


# /POST /post/argument/dislike

## Request

> post_token : String

> comment_token : String

## Response : Success

> status : 200

> message : Save Success

## Response : Fail

> status : 404

> message : Comment not Found

## Response : Fail

> status : 404

> message : Post not Found

# POST /post/add/relay/comment

## Request 

> comment_token : String

> uid : String

> reply_comment : reply_comment

## Response : Success

> status : 200

> message : Save Success

## Response : Fail

> status : 404

> message : Comment not Found

## Response : Fail

> status : 404

> message : Post not Found

# GET /post/get/reply/:comment_token

# Request

> comment_token : String

# Response

> status : 200

> data : comment model 참조
