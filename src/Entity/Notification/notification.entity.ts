import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration } from "../../Enums/contract.enum";
import { NotificationType } from "../../Enums/notificationTypes.enum";

@Entity()
export class Notifications implements INotification{
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({type:"date",nullable:false})
    date:Date

    @Column({nullable:false})
    account:string


    @Column({nullable:false,type:"enum", enum:NotificationType})
    notification_type:NotificationType

    @Column({nullable:false})
    message:string


    @Column({nullable:false})
    subject:string
    
    @Column({nullable:true,type:'jsonb'})
    metadata:Record<string,string>


    
}

export interface INotification{
    id:number
    account:string
    notification_type:NotificationType
    message:string
    subject:string
    date:Date
    metadata:Record<string,string>

    
}

export interface INotificationResponse{
    notification_type:NotificationType
    message:string
    subject:string
    date:Date
   

    
}