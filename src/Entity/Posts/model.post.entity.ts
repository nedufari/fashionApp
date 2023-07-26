import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class UserPostsEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({nullable:true})
    caption:string

    @CreateDateColumn()
    cratedDate:Date

    @Column({nullable:true})
    media:string

    @Column({type:"simple-array",nullable:true})
    likes:string[]

    @Column({type:"simple-array",nullable:true})
    shares:string[]

    @Column({type:"simple-array",nullable:true})
    comments:string[]

    //relationship
    // @ManyToOne(()=> UsersEntity, (fd:UsersEntity)=>fd.posts)
    // owner:UsersEntity[]

    


    

    

    
}