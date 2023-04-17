import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HairModelsEntity } from "../../users/BrandModelsUsers/hairmodels.entity";

@Entity()
export class HairMdodelPostsEntity{
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

    @OneToOne(()=>HairModelsEntity,(desginer:HairModelsEntity)=> desginer.contractor)
    designer:HairModelsEntity

    @OneToOne(()=>HairModelsEntity,(photographer:HairModelsEntity)=>photographer.photographer)
    photographer:HairModelsEntity
} 