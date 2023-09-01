import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, } from "typeorm";
import { TransactionType } from "../../Enums/wallet.enum";



export interface ITransaction{
    TransactionID:number,
    amount:number,
    to:string,
    from:string
    TransactionType:TransactionType,
    TransactionDate:Date,
    TransactionReference:string
}

export interface ITransactionResponseForWithdrawal{
    TransactionID:number,
    amount:number,
    to:string,
    TransactionType:TransactionType,
    TransactionDate:Date,
    TransactionReference:string
}

export interface ITransactionResponseForDeposit{
    TransactionID:number,
    amount:number,
    from:string,
    TransactionType:TransactionType,
    TransactionDate:Date,
    TransactionReference:string
}

export interface ITransactionResponseForPurchase{
    TransactionID:number,
    amount:number,
    from:string,
    to:string,
    TransactionType:TransactionType,
    TransactionDate:Date,
    TransactionReference:string
}


@Entity()
export class TransactionEntity implements ITransaction{
    @PrimaryGeneratedColumn('uuid')
    TransactionID:number

    @Column({nullable:true})
    amount:number

    @Column({type:'enum',enum:TransactionType, nullable:true})
    TransactionType:TransactionType

    @Column({nullable:true})
    from:string

    @Column({nullable:true})
    to:string

    @CreateDateColumn()
    TransactionDate:Date
    

    @Column({nullable:true})
    TransactionReference:string



}