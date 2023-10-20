import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../Users/customer.entity";


export interface IWallet{
    walletid:string
    balance:number
    cratedDate:Date
    PIN:string
    owner:string
}
interface ICustomerInfo {
    
    username: string;
}



export interface IWalletResponse{
    walletid:string
    balance:number
    cratedDate:Date
    owner:ICustomerInfo
}

@Entity('wallet')
export class Wallet implements IWallet{
    @PrimaryGeneratedColumn('uuid')
    walletid:string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    cratedDate:Date

    @Column({nullable:false})
    PIN : string

   @Column({nullable:false})
    owner:string
}