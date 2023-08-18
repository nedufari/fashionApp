import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { CommentsRepository, CustomerEntityRepository, RepliesRepository } from "../../auth/auth.repository";
import { CustomerMakeCommentDto, CustomerReplyDto, LikeDto } from "./customers.dto";
import { Comments, ICustomerCommentResponse } from "../../Entity/Activities/comment.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { VendorPostRepository } from "../../contract/contrct.repository";
import { ICustomerReplyResponse, Replies } from "../../Entity/Activities/reply.entity";
import { LikeAction } from "../../Enums/post.enum";

@Injectable()
export class CustomerService{
    constructor(@InjectRepository(CustomerEntity)private readonly customerripository:CustomerEntityRepository,
    @InjectRepository(VendorPostsEntity)private readonly vendorpostripo:VendorPostRepository,
    @InjectRepository(Comments)private readonly commentripo:CommentsRepository,
    @InjectRepository(Replies)private readonly replyripo:RepliesRepository,
    ){}

    
    //like a post 
    //dislike a post 
    //send order request on a particular post 
    //mke payment 


    //mke comments
    async makeComment(postid:number, customerid:string, commentdto:CustomerMakeCommentDto):Promise<ICustomerCommentResponse>{
        const findpost = await this.vendorpostripo.findOne({where:{id:postid}})
        if (!findpost) throw new HttpException('the post is not found',HttpStatus.NOT_FOUND)

        const customer = await this.customerripository.findOne({where:{CustomerID:customerid}})
        if (!customer) throw new HttpException('the customer  is not found',HttpStatus.NOT_FOUND)

        const comment = new Comments()
        comment.content = commentdto.comment,
        comment.customer =  customer
        await this.commentripo.save(comment)

        const commentResponse : ICustomerCommentResponse = {
            id: comment.id,
            content:comment.content,
            customer:{
                digital_photo: customer.digital_photo,
                username: customer.username
            }
        }
        return commentResponse
    }

     //reply comments 
    async replycomment(commentid:number, customerid:string, replydto:CustomerReplyDto):Promise<ICustomerReplyResponse>{
        const findcomment = await this.commentripo.findOne({where:{id:commentid}})
        if (!findcomment) throw new HttpException('the post is not found',HttpStatus.NOT_FOUND)

        const customer = await this.customerripository.findOne({where:{CustomerID:customerid}})
        if (!customer) throw new HttpException('the customer  is not found',HttpStatus.NOT_FOUND)

        const reply = new Replies()
        reply.reply = replydto.reply,
        reply.comment = findcomment
        reply.customer = customer,
        await this.replyripo.save(reply)

        const ReplyResponse : ICustomerReplyResponse = {
            id :reply.id,
            
            comment :{
                comment :findcomment.content
            },
            reply :reply.reply,
            customer :{
                digital_photo: customer.digital_photo,
                username: customer.username

            }
        }

        return ReplyResponse


    }

    async likeAPost(postid:number,customerid:string,likedto:LikeDto):Promise<{message:string}>{
        const findpost = await this.vendorpostripo.findOne({where:{id:postid}})
        if (!findpost) throw new HttpException('the post is not found',HttpStatus.NOT_FOUND)

        const customer = await this.customerripository.findOne({where:{CustomerID:customerid}})
        if (!customer) throw new HttpException('the customer  is not found',HttpStatus.NOT_FOUND)

        if (likedto.action == LikeAction.LIKE){
            findpost.likes += 1,
            // findpost.likedBy.push(customer.username)
            await this.vendorpostripo.save(findpost)

        }
        return {message:"yu have liked this post"}

    }

    async DislikeAPost(postid:number,customerid:string,likedto:LikeDto):Promise<void>{
        const findpost = await this.vendorpostripo.findOne({where:{id:postid}})
        if (!findpost) throw new HttpException('the post is not found',HttpStatus.NOT_FOUND)

        const customer = await this.customerripository.findOne({where:{CustomerID:customerid}})
        if (!customer) throw new HttpException('the customer  is not found',HttpStatus.NOT_FOUND)

        if (likedto.action == LikeAction.LIKE){
            findpost.dislikes += 1,
            findpost.dislikedBy.push(customer.username)
            await this.vendorpostripo.save(findpost)

        }

    }

}