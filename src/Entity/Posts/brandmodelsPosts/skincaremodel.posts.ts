import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SkincareModelsEntity } from "../../users/BrandModelsUsers/skincaremodels.entity";

@Entity()
export class SkinCareMdodelPostsEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    media:string

    @Column({length:300})
    captions:string

    @CreateDateColumn()
    cratedDate:Date

    @Column({type:'simple-array'})
    likes:string[]

    @Column({type:"simple-array"})
    shares:string[]

    @Column({type:"simple-array"})
    comments:string[]

    @OneToOne(()=>SkincareModelsEntity,(desginer:SkincareModelsEntity)=> desginer.contractor)
    makeup_artiste:SkincareModelsEntity

    @OneToOne(()=>SkincareModelsEntity,(photographer:SkincareModelsEntity)=>photographer.photographer)
    photographer:SkincareModelsEntity
} 