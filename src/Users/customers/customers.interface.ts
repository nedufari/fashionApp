import { Comments, ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses, Replies } from "../../Entity/Activities/reply.entity"

export interface ICustomer{
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
    CustomerID:string
    is_locked:boolean
    is_locked_until:Date
    comments:Comments[]
    replies:Replies[]
}

export interface ICustomerResponse{
    digital_photo:string
    username:string 
    gender:string 
    fullname:string 
    CustomerID:string
    comments:ICommentResponses[]
    replies:IRepliesResponses[]
}