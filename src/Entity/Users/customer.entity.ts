import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Roles } from "../../Enums/roles.enum"
import { ICustomer } from "../../Users/customers/customers.interface"
import { Comments } from "../Activities/comment.entity"
import { Replies } from "../Activities/reply.entity"
import { CustomerCartEntity } from "../Cart/customer.cart.entity"

@Entity()
export class CustomerEntity implements ICustomer{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({nullable:true})
    CustomerID:string

    @Column({unique:true,nullable:false})
    email:string

    @Column({unique:true,nullable:true})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true, unique:true})
    fullname:string

    
    @Column({nullable:true})
    address:string

    @Column({nullable:true})
    digital_photo:string

    @Column({nullable:true})
    gender:string

    @Column({nullable:true})
    bio:string

     
    @Column({nullable:true})
    phone:string

    @CreateDateColumn()
    created_at:Date

    @Column({type:"enum", enum:Roles, default:Roles.CUSTOMER})
    role:Roles

    @Column({type:"boolean", default:false,nullable:true})
    is_active:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_verified:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_deleted:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_profile_completed:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_logged_in:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_logged_out:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_locked:boolean

    @Column({nullable:true})
    is_locked_until:Date

    @Column({nullable:true})
    password_reset_link:string

    @Column({nullable:true})
    reset_link_exptime:Date


    @Column({type:"date", nullable:true})
    last_login:Date

    @Column({ default:0,nullable:true})
    login_count:number

    @OneToMany(()=>Comments,comment=>comment.customer)
    comments:Comments[]

    @OneToMany(()=>Replies,reply=>reply.customer)
    replies:Replies[]

    @OneToMany(()=>CustomerCartEntity,(cart)=>cart.customer)
    carts:CustomerCartEntity[]
}
