import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ComplaintResolutionLevel, complaintsType } from "../../Enums/complaint.enum";

export interface IComplaint{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    pictorial_proof:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 
    walletID:string
    tracking_number:string
    reciept_number:string
    cvn:string

}

export interface IAbuseComplaintResponse{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    pictorial_proof:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}

export interface IPaymentComplaintResponse{
    issueID:string
    complaint_type:complaintsType
    reported_at : Date
    issue:string
    reciept_number:string
    complaint_resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}

export interface IContractComplaintResponse{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    cvn:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}

export interface IOrderComplaintResponse{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    tracking_number:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}

export interface IWalletComplaintResponse{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    walletID:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}

export interface IOtherComplaintResponse{
    issueID:string
    issue_type:complaintsType
    reported_at : Date
    issue:string
    resolution_level:ComplaintResolutionLevel
    complainerID:string 
    complainerRole:string 

}


@Entity()
export class ComplaintsEntity implements IComplaint{

    @PrimaryGeneratedColumn('uuid')
    issueID: string

    @Column({type:"enum", enum:complaintsType,nullable:false})
    issue_type:complaintsType

    @CreateDateColumn()
    reported_at : Date

    @Column({nullable:true})
    issue:string

    @Column({nullable:true})
    walletID:string

    @Column({nullable:true})
    tracking_number:string

    @Column({nullable:true})
    reciept_number:string

    @Column({nullable:true})
    pictorial_proof:string

    @Column({nullable:true})
    cvn:string

    @Column({type:"enum", enum:ComplaintResolutionLevel,nullable:false})
    resolution_level:ComplaintResolutionLevel

    @Column({nullable:false})
    complainerID:string 

    @Column({nullable:false})
    complainerRole:string 


}