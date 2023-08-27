import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../Enums/roles.enum";

export interface IUserOtp {
    id:number
    email: string;
    otp: string;
    role: Roles;
    expiration_time: Date;
    verified: boolean;
    created_at: Date;
  }

  @Entity()
  export class UserOtp implements IUserOtp{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:false}) //so that one user can improve
    email: string;

    @Column({type:'enum', enum:Roles,nullable:true })
    role:Roles

    @Column({type:'boolean',default:false})
    verified: boolean;

    @CreateDateColumn()
    expiration_time:Date

    @CreateDateColumn()
    created_at:Date

    @Column()
    otp: string;
  }