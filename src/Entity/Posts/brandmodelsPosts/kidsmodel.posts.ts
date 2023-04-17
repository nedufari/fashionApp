import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { KidsModelsEntity } from "../../users/BrandModelsUsers/kidsmodels.entity";

@Entity()
export class KidsMdodelPostsEntity{
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

    @OneToOne(()=>KidsModelsEntity,(desginer:KidsModelsEntity)=> desginer.contractor)
    designer:KidsModelsEntity

    @OneToOne(()=>KidsModelsEntity,(photographer:KidsModelsEntity)=>photographer.photographer)
    photographer:KidsModelsEntity
} 