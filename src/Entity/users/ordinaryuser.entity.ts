import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";

@Entity()
export class OrdinaryUserEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true})
    email:string

    @Column({length: 10})
    password:string

    @Column()
    name:string

    @Column()
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.ORDINARY_USERS})
    role:Roles

    @Column({length:11})
    phone:string

   @Column()
   digitalPicture:string


    

    
}