import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration } from "../../Enums/contractDuration.enum";
import { NotificationType } from "../../Enums/notificationTypes.enum";

@Entity()
export class Notifications{
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({type:"date",nullable:false})
    date:Date

    @Column({nullable:false})
    account:string


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    notification_type:NotificationType

    @Column({nullable:false})
    message:string


    @Column({nullable:false})
    subject:string
    
    @Column({nullable:false,type:'jsonb'})
    metadata:Record<string,string>


    // @ManyToOne(()=>FashionDesignerEntity,(contractor:FashionDesignerEntity)=>contractor.brandname)
    // fashion_mogul:FashionDesignerEntity

}