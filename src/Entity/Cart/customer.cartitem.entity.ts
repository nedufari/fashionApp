import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../Users/customer.entity";
import { CustomerCartEntity } from "./customer.cart.entity";


export interface ICustomerCartItem{
    id:number
    created_at:Date
    cart: CustomerCartEntity
    productID:number
    quantity:number
}


@Entity()
export class CustomerCartItemEntity implements ICustomerCartItem{

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn()
    created_at:Date

    @ManyToOne(()=>CustomerCartEntity, (cart)=> cart.cartItem)
    cart: CustomerCartEntity

    @Column()
    productID:number

    @Column()
    quantity:number
}