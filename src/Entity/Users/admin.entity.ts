import { Column, Entity, PrimaryGeneratedColumn,Generated, OneToMany, CreateDateColumn } from "typeorm"
import { Roles } from "../../Enums/roles.enum"
import { IAdmin } from "../../Users/admin/admin.interface"
import { Comments } from "../Activities/comment.entity"
import { Replies } from "../Activities/reply.entity"

@Entity()
export class AdminEntity implements IAdmin{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column()
    AdminID:string

    @Column({unique:true,nullable:false})
    email:string

    @Column({unique:true,nullable:true})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true})
    fullname:string

    @Column({nullable:true})
    gender:string

    @Column({nullable:true})
    digital_photo:string

    @Column({type:"enum", enum:Roles, default:Roles.ADMIN})
    role:Roles

    @CreateDateColumn()
    created_at:Date

    @Column({type:"boolean", default:false,nullable:true})
    is_active:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_verified:boolean


    @Column({type:"boolean", default:false,nullable:true})
    is_logged_in:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_logged_out:boolean

    @Column({type:"date", nullable:true})
    last_login:Date

    @Column({ default:0,nullable:true})
    login_count:number

    @OneToMany(()=>Comments,comment=>comment.admin)
    comments:Comments[]

    @OneToMany(()=>Replies,reply=>reply.admin)
    replies:Replies[]
}