import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModelEntity } from "../Users/model.entity";
import { PhotographerEntity } from "../Users/photorapher.entity";
import { AdminEntity } from "../Users/admin.entity";
import { CustomerEntity } from "../Users/customer.entity";
import { Replies } from "./reply.entity";
import { vendorEntity } from "../Users/vendor.entity";
import { VendorPostsEntity } from "../Posts/vendor.post.entity";

export interface ICommentResponses{
    
}
export interface IComment {
    id: number;
    content: string;
    model?: ModelEntity;
    photographer?: PhotographerEntity;
    admin?: AdminEntity;
    customer?: CustomerEntity;
    vendor?: VendorPostsEntity;
    post?: VendorPostsEntity;
    replies: Replies[];
}

export interface IModelCommentResponse {
    id: number;
    content: string;
    model: Partial<ModelEntity>;
    
}

export interface IPhotographerCommentResponse {
    id: number;
    content: string;
    photographer: Partial<PhotographerEntity>;
    replies: Replies[];
}

export interface IAdminCommentResponse {
    id: number;
    content: string;
    admin: Partial<AdminEntity>;
    
}

interface ICustomerInfo {
    digital_photo: string;
    username: string;
}

// interface IModelInfo {
//     digital_photo: string;
//     username: string;
// }

// interface IPhotographerInfo {
//     digital_photo: string;
//     username: string;
// }

// interface IVendorInfo {
//     digital_photo: string;
//     username: string;
// }

export interface ICustomerCommentResponse {
    id: number;
    content: string;
    customer: ICustomerInfo;
   
}

export interface IVendorCommentResponse {
    id: number;
    content: string;
    vendor: Partial<VendorPostsEntity>;
    replies: Replies[];
}





@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ModelEntity, model => model.comments, { cascade: true, onDelete: 'CASCADE' })
    model?: ModelEntity;

    @ManyToOne(() => PhotographerEntity, photographer => photographer.comments, { cascade: true, onDelete: 'CASCADE' })
    photographer?: PhotographerEntity;

    @ManyToOne(() => AdminEntity, admin => admin.comments, { cascade: true, onDelete: 'CASCADE' })
    admin?: AdminEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.comments, { cascade: true, onDelete: 'CASCADE' })
    customer?: CustomerEntity;

    @ManyToOne(()=>VendorPostsEntity,vendorentity=>vendorentity.comments, { cascade: true, onDelete: 'CASCADE' })
    vendor?:VendorPostsEntity

    @ManyToOne(() => VendorPostsEntity, post => post.comments)
    post?: VendorPostsEntity;

    @OneToMany(() => Replies, reply => reply.comment)
    replies: Replies[];
}

