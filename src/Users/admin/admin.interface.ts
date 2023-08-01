import { Comments, ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses, Replies } from "../../Entity/Activities/reply.entity"

export  interface IAdmin{
    id:string
    email:string
    password:string
    digital_photo:string
    username:string 
    gender:string 
    fullname:string 
    is_active:boolean
    is_verified:boolean
    is_logged_in:boolean
    is_logged_out:boolean
    last_login:Date
    login_count:number
    AdminID:string
    is_locked:boolean
    is_locked_until:Date
    comments:Comments[]
    replies:Replies[]
}

export  interface IAdminResponse{
    AdminID:string
    digital_photo:string
    username:string 
    gender:string 
    fullname:string 
    comments: ICommentResponses[]
    replies:IRepliesResponses[]
}

export  interface IAdminResponseComment{
    username:string 
    comments: ICommentResponses[]
    replies:IRepliesResponses[]
}