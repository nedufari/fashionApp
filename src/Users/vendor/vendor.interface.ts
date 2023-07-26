import { ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses } from "../../Entity/Activities/reply.entity"
import { KindOfModel } from "../../Enums/modelType.enum"
import { PaymentPlan } from "../../Enums/paymentOption.enum"

export interface IVendor{
    id:string,
    email:string,
    password:string
    brandname:string 
    address:string 
    phone1:string 
    phone2:string 
    bio:string 
    gender:string
    facebook:string 
    twitter:string
    thread:string
    instagram:string
    tiktok:string
    snapchat:string 
    display_photo:string
    is_active:boolean
    is_verified:boolean
    is_deleted:boolean
    is_profile_completed:boolean
    is_on_contract:boolean
    is_contract_terminated:boolean
    is_logged_in:boolean
    is_logged_out:boolean
    last_login:Date
    login_count:number
    VendorID:string

}

export interface IVendorResponse{
    brandname:string 
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
    negotiable:boolean
    display_photo:string
    kindofmodel:KindOfModel
    paymentplan:PaymentPlan
    VendorID:string

}

export  interface IVendorResponseComment{
    
    digital_photo:string
    username:string 
    comments: ICommentResponses[]
    replies:IRepliesResponses[]
}