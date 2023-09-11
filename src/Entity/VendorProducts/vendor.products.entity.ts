import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VendorPostsEntity } from "../Posts/vendor.post.entity";


export interface IVendorProduct{
    id:number
    price:number
    images:string[]
    post:VendorPostsEntity
}

@Entity()
export class VendorProducts implements IVendorProduct{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    price:number

    @Column({type:'jsonb',nullable:true,})
    images:string[]

    @ManyToOne(()=>VendorPostsEntity)
    @JoinColumn()
    post:VendorPostsEntity


}