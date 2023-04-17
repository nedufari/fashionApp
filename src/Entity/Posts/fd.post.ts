import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";
import { FashionDesignerEntity } from "../users/fashiodesigner.entity";
import { PhotographerEntity } from "../users/photographers.entity";
import { FashionModelsEntity } from "../users/BrandModelsUsers/fashionmodels.entity";

@Entity()
export class FashionDesignerPostsEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true})
    caption:string

    @CreateDateColumn()
    cratedDate:Date

    @Column()
    media:string

    @Column({type:"simple-array"})
    likes:string[]

    @Column({type:"simple-array"})
    shares:string[]

    @Column({type:"simple-array"})
    comments:string[]

    //relationships with models and photographers  and the author
    //an author can make many posts ie manytoone
    //a model can model more than one brand manytoone
    //photpgrapher can take a clip or shot for just oone post ie onetoone
    @ManyToOne(()=> FashionDesignerEntity, (fd:FashionDesignerEntity)=>fd.brandmodels)
    brandmodel:FashionDesignerEntity[]

    @ManyToOne(()=> FashionDesignerEntity, (fd:FashionDesignerEntity)=>fd.posts)
    designer:FashionDesignerEntity

    // apost can only be taken by a a photographer
    @OneToOne(()=> FashionDesignerEntity, (fd:FashionDesignerEntity)=>fd.photographer)
    photographer:FashionDesignerEntity

    

    

    
}