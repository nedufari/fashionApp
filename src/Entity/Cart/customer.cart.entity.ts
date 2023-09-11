import { CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../Users/customer.entity";
import { CustomerCartItemEntity } from "./customer.cartitem.entity";


export interface ICustomerCart{
    id:number
    customer: CustomerEntity
    cartItem:CustomerCartItemEntity[]
    created_at:Date

}


@Entity()
export class CustomerCartEntity implements ICustomerCart{

    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>CustomerEntity, (customer)=> customer.carts)
    customer: CustomerEntity

    @OneToMany(()=>CustomerCartItemEntity, (cartitem)=>cartitem.cart)
    cartItem:CustomerCartItemEntity[]

    @CreateDateColumn()
    created_at:Date
}