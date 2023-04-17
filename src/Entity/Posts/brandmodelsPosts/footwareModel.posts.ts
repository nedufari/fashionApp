import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FootwearModelsEntity } from "../../users/BrandModelsUsers/footwaremodels.entity";

@Entity()
export class FootwareMdodelPostsEntity{
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

    @OneToOne(()=>FootwearModelsEntity,(desginer:FootwearModelsEntity)=> desginer.contractor)
    designer:FootwearModelsEntity

    @OneToOne(()=>FootwearModelsEntity,(photographer:FootwearModelsEntity)=>photographer.photographer)
    photographer:FootwearModelsEntity 
} 