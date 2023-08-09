import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModelEntity } from "../Users/model.entity";
import { PhotographerEntity } from "../Users/photorapher.entity";
import { AdminEntity } from "../Users/admin.entity";
import { CustomerEntity } from "../Users/customer.entity";
import { Replies } from "./reply.entity";
import { vendorEntity } from "../Users/vendor.entity";
import { VendorPostsEntity } from "../Posts/vendor.post.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ModelEntity, model => model.comments)
    model?: ModelEntity;

    @ManyToOne(() => PhotographerEntity, photographer => photographer.comments)
    photographer?: PhotographerEntity;

    @ManyToOne(() => AdminEntity, admin => admin.comments)
    admin?: AdminEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.comments)
    customer?: CustomerEntity;

    @ManyToOne(()=>VendorPostsEntity,vendorentity=>vendorentity.comments)
    vendor?:VendorPostsEntity

    @ManyToOne(() => VendorPostsEntity, post => post.comments)
    post?: VendorPostsEntity;

    @OneToMany(() => Replies, reply => reply.comment)
    replies: Replies[];
}
