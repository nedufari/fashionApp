import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";
import { FashionDesignerPostsEntity } from "../Posts/fd.post";
import { fstat } from "fs";
import { FashionModelsEntity } from "./BrandModelsUsers/fashionmodels.entity";
import { PhotographerEntity } from "./photographers.entity";

@Entity()
export class FashionDesignerEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true,nullable:false})
    email:string

    @Column({unique:true,nullable:true})
    brandname:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true})
    name:string

    @Column({nullable:true})
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.FASHION_MOGUL})
    role:Roles

    @Column({length:11,nullable:true})
    phone1:string

    @Column({length:11,nullable:true})
    phone2:string

    @Column({length:300,nullable:true})
    bio:string

    @Column({nullable:true})
    fashion_genre: string 

    @CreateDateColumn()
    cratedDate:Date

    //fashion designer can make many post ie one to many
    @OneToMany(()=> FashionDesignerPostsEntity,(fdpost:FashionDesignerPostsEntity)=>fdpost.designer)
    posts:FashionDesignerPostsEntity[]

    //fashion designer can have more than one model
    @OneToMany(()=> FashionModelsEntity,(model:FashionModelsEntity)=>model.contractor)
    brandmodels:FashionModelsEntity[]

    //a designer can have just one photographer 
    @OneToOne(()=> PhotographerEntity,(photographer:PhotographerEntity)=>photographer.contractor)
    photographer:PhotographerEntity

    


    

    
}