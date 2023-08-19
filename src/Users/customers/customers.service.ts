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

    

    //send order request on a particular post 
    //mke payment 


    //make a comment
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


//like a post
    async likeAPost(postid: number, customerid: string, likedto: LikeDto): Promise<{ message: string }> {
        try {
            const findpost = await this.vendorpostripo.findOne({ where: { id: postid } });
        if (!findpost) {
            throw new HttpException('The post is not found', HttpStatus.NOT_FOUND);
        }
    
        const customer = await this.customerripository.findOne({ where: { CustomerID: customerid } });
        if (!customer) {
            throw new HttpException('The customer is not found', HttpStatus.NOT_FOUND);
        }
    
        if (likedto.action === LikeAction.LIKE) {
            // Check if the post has been liked by the same user before
            if (findpost.likedBy && findpost.likedBy.includes(customer.username)) {
                return { message: 'You have already liked this post' };
            }
    
            // Check if the post has been disliked by the same user before
            if (findpost.dislikedBy && findpost.dislikedBy.includes(customer.username)) {
                const dislikedIndex = findpost.dislikedBy.indexOf(customer.username);
                findpost.dislikedBy.splice(dislikedIndex, 1);
                findpost.dislikes -= 1;
            }
            else {
                // Initialize the dislikedBy array if it's null
                findpost.dislikedBy = [];
            }
    
            findpost.likes += 1;
            findpost.likedBy = findpost.likedBy || [];
            findpost.likedBy.push(customer.username);
            await this.vendorpostripo.save(findpost);
    
            return { message: 'You have liked this post' };
        }
    }
       
            
         catch (error) {
            throw error
            
        }
        
    }
    
    
//dislike a post 
    async DislikeAPost(postid:number,customerid:string,likedto:LikeDto):Promise<{message:string}>{
        try {
            const findpost = await this.vendorpostripo.findOne({ where: { id: postid } });
        if (!findpost) {
            throw new HttpException('The post is not found', HttpStatus.NOT_FOUND);
        }
    
        const customer = await this.customerripository.findOne({ where: { CustomerID: customerid } });
        if (!customer) {
            throw new HttpException('The customer is not found', HttpStatus.NOT_FOUND);
        }
    
        if (likedto.action === LikeAction.DISLIKE) {
            // Check if the post has been liked by the same user before
            if (findpost.dislikedBy && findpost.dislikedBy.includes(customer.username)) {
                return { message: 'You have already disliked this post' };
            }
    
            // Check if the post has been disliked by the same user before
            if (findpost.likedBy && findpost.likedBy.includes(customer.username)) {
                const likedIndex = findpost.likedBy.indexOf(customer.username);
                findpost.likedBy.splice(likedIndex, 1);
                findpost.likes -= 1;
            }
            else {
                // Initialize the likedBy array if it's null
                findpost.likedBy = [];
            }
    
            findpost.dislikes += 1;
            findpost.dislikedBy = findpost.likedBy || [];
            findpost.dislikedBy.push(customer.username);
            await this.vendorpostripo.save(findpost);
    
            return { message: 'You have disliked this post' };
        }
    }
       
            
         catch (error) {
            throw error
            
        }
      
        }

//create an order on a particular post 

    }

