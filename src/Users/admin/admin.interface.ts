import { Comments, ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses, Replies } from "../../Entity/Activities/reply.entity"
import { AdminTypes, ClearanceLevels } from "../../Enums/roles.enum"

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
    created_at:Date
    AdminID:string
    ClearanceLevel:ClearanceLevels
    AdminType:AdminTypes
    is_locked:boolean
    is_locked_until:Date
    password_reset_link:string
    reset_link_exptime:Date
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

export interface ICreateOtherAdmin {
    id:string
    AdminID:string
    email:string
    ClearanceLevel:ClearanceLevels
    AdminType:AdminTypes
    password:string
    created_at:Date
}

export interface IUpgradeAdminClearanceLevel {
    ClearanceLevel:ClearanceLevels
   
}

export interface IChangeAdminType{
    AdminType:AdminTypes
   
}

export interface IAdminChangePassword{
    password:string
}



