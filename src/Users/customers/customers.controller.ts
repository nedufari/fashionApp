import { Body, Controller, Param, Post } from "@nestjs/common";
import { CustomerService } from "./customers.service";
import { ICustomerCommentResponse } from "../../Entity/Activities/comment.entity";
import { CustomerMakeCommentDto, CustomerReplyDto, LikeDto } from "./customers.dto";
import { ICustomerReplyResponse } from "../../Entity/Activities/reply.entity";

@Controller('customer')
export class CustomerControlller{
    constructor(private readonly customerservice:CustomerService){}

    @Post('comment/:postid/:customerid')
    async MakePost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:CustomerMakeCommentDto):Promise<ICustomerCommentResponse>{
        return await this.customerservice.makeComment(postid,customerid,dto)
    }

    @Post('reply/:commentid/:customerid')
    async ReplyComment(@Param('commentid')commentid:number,@Param('customerid')customerid:string,@Body()dto:CustomerReplyDto):Promise<ICustomerReplyResponse>{
        return await this.customerservice.replycomment(commentid,customerid,dto)
    }

    @Post('like/:posttid/:customerid')
    async likeaPost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:LikeDto):Promise<{message:string}>{
        return await this.customerservice.likeAPost(postid,customerid,dto)
    }
}