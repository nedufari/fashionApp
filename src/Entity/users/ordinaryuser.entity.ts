import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";

@Entity()
export class OrdinaryUserEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true,nullable:false})
    email:string

    @Column({nullable:false})
    password:string

    @Column({nullable:false})
    name:string

    @Column({nullable:true})
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.ORDINARY_USERS})
    role:Roles

    @Column({length:11,nullable:true})
    phone:string

   @Column({nullable:true})
   digitalPicture:string


    

    
}