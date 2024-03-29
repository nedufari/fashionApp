import { Comments, ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses, Replies } from "../../Entity/Activities/reply.entity"
import { Negotiable } from "../../Enums/contract.enum"
import { KindOfModel } from "../../Enums/modelType.enum"
import { PaymentPlan } from "../../Enums/paymentOption.enum"

export interface IPhotographer{
    id:string,
    email:string,
    password:string
    brandname:string 
    fullname:string
    address:string 
    phone1:string 
    phone2:string 
    bio:string 
    age:number
    gender:string
    facebook:string 
    twitter:string
    thread:string
    instagram:string
    tiktok:string
    snapchat:string
    pricerange: string 
    negotiable:Negotiable
    displayPicture:string
    paymentplan:PaymentPlan
    is_active:boolean
    is_verified:boolean
    is_on_waitlist:boolean
    is_deleted:boolean
    is_profile_completed:boolean
    is_on_contract:boolean
    is_contract_terminated:boolean
    is_logged_in:boolean
    is_logged_out:boolean
    last_login:Date
    login_count:number
    PhotographerID:string
    password_reset_link:string
    reset_link_exptime:Date
    comments:Comments[]
    replies:Replies[]

}

export interface IPhotographerResponse{
    brandname:string 
    fullname:string
    address:string 
    phone1:string 
    phone2:string 
    bio:string 
    age:number
    gender:string
    facebook:string 
    twitter:string
    thread:string
    instagram:string
    tiktok:string
    snapchat:string
    pricerange: string 
    negotiable:Negotiable
    displayPicture:string
    paymentplan:PaymentPlan
    PhotographerID:string
   

}

export  interface IPhotographerResponseComment{
    
    digital_photo:string
    username:string 
    comments: ICommentResponses[]
    replies:IRepliesResponses[]
}