import { Comments, ICommentResponses } from "../../Entity/Activities/comment.entity"
import { IRepliesResponses, Replies } from "../../Entity/Activities/reply.entity"
import { KindOfModel } from "../../Enums/modelType.enum"
import { PaymentPlan } from "../../Enums/paymentOption.enum"

export interface IModel{
    id:string,
    email:string,
    password:string
    brandname:string 
    address:string 
    phone1:string 
    phone2:string 
    bio:string 
    fashion_genre:string 
    digital_photo:string 
    age:number
    gender:string 
    complexion:string 
    on_low_cut:boolean
    state_of_residence:string 
    height_in_ft:string 
    weight_in_kg:string 
    facebook:string 
    twitter:string
    thread:string
    instagram:string
    tiktok:string
    snapchat:string
    Managerfacebook:string
    Managerinstagram:string
    Managertwitter:string
    gown_size:string
    blouse_size:string
    skirt_size:string
    trouser_size:string
    shirt_size:string
    hat_size:string

/// measurements for fresh sewn dresses

    shoulder:string
    burst:string
    burst_point:string
    round_under_burst:string
    under_burst_length:string
    nipple_to_nipple:string
    half_length:string
    arm_hole:string
    sleve_short:string
    sleve_long:string
    sleve_3qtr:string
    Round_sleeve:string
    elbow:string
    heep:string
    heep_length:string
    flap:string
    waist:string
    blouse_length:string
    gown_length:string
    skirt_length:string
    knee_length:string
    trouser_length:string
    ankle:string
    thigh:string
    wrist:string

/// measurements for fresh sewn dresses for guys a some can also be gotten from
    chest:string
    shirt_length:string
    top_length:string
    back:string
    caps_ize:string  
    shoe_size:string 
    alternative_shoe_size:string
    pricerange: string 
    negotiable:boolean
    displayPicture:string
    kindofmodel:KindOfModel
    paymentplan:PaymentPlan
    ModelID:string
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
    is_locked:boolean
    password_reset_link:string
    reset_link_exptime:Date
    is_locked_until:Date
    comments:Comments[]
    replies:Replies[]
    
    
}


export  interface IModelResponseComment{
    digital_photo:string
    username:string 
    comments: ICommentResponses[]
    replies:IRepliesResponses[]
}


export interface IModelResponse{
    brandname:string 
    address:string 
    phone1:string 
    phone2:string 
    bio:string 
    fashion_genre:string 
    digital_photo:string 
    age:number
    gender:string 
    complexion:string 
    on_low_cut:boolean
    state_of_residence:string 
    height_in_ft:string 
    weight_in_kg:string 
    facebook:string 
    twitter:string
    thread:string
    instagram:string
    tiktok:string
    snapchat:string
    Managerfacebook:string
    Managerinstagram:string
    Managertwitter:string
    gown_size:string
    blouse_size:string
    skirt_size:string
    trouser_size:string
    shirt_size:string
    hat_size:string
   

/// measurements for fresh sewn dresses

    shoulder:string
    burst:string
    burst_point:string
    round_under_burst:string
    under_burst_length:string
    nipple_to_nipple:string
    half_length:string
    arm_hole:string
    sleve_short:string
    sleve_long:string
    sleve_3qtr:string
    Round_sleeve:string
    elbow:string
    heep:string
    heep_length:string
    flap:string
    waist:string
    blouse_length:string
    gown_length:string
    skirt_length:string
    knee_length:string
    trouser_length:string
    ankle:string
    thigh:string
    wrist:string

/// measurements for fresh sewn dresses for guys a some can also be gotten from
    chest:string
    shirt_length:string
    top_length:string
    back:string
    caps_ize:string  
    shoe_size:string 
    alternative_shoe_size:string
    pricerange: string 
    negotiable:boolean
    displayPicture:string
    kindofmodel:KindOfModel
    paymentplan:PaymentPlan
    ModelID:string
    comments:ICommentResponses[]
    replies:IRepliesResponses[]

}