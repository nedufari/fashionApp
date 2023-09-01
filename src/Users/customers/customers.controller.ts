import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CustomerService } from "./customers.service";
import { ICustomerCommentResponse } from "../../Entity/Activities/comment.entity";
import { CustomerMakeCommentDto, CustomerReplyDto, LikeDto } from "./customers.dto";
import { ICustomerReplyResponse } from "../../Entity/Activities/reply.entity";
import { IVendorPostResponse } from "../../Entity/Posts/vendor.post.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "../../uploads.service";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";

@Controller('customer')
export class CustomerControlller{
    constructor(private readonly customerservice:CustomerService,
      private readonly fileuploadservice:UploadService){}

    @Post('comment/:postid/:customerid')
    async MakePost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:CustomerMakeCommentDto):Promise<ICustomerCommentResponse>{
        return await this.customerservice.makeComment(postid,customerid,dto)
    }

    @Post('reply/:commentid/:customerid')
    async ReplyComment(@Param('commentid')commentid:number,@Param('customerid')customerid:string,@Body()dto:CustomerReplyDto):Promise<ICustomerReplyResponse>{
        return await this.customerservice.replycomment(commentid,customerid,dto)
    }

    @Post('like/:postid/:customerid')
    async likeaPost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:LikeDto):Promise<{message:string}>{
        return await this.customerservice.likeAPost(postid,customerid,dto)
    }

    @Get('notification/:customer')
    async findmyNotifications(@Param('customer')customer:string):Promise<INotificationResponse[]>{
        return await this.customerservice.getMyNotifications(customer)
    }

    @Post('dislike/:postid/:customerid')
    async dislikeaPost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:LikeDto):Promise<{message:string}>{
        return await this.customerservice.DislikeAPost(postid,customerid,dto)
    }

    @Get('vendorposts')
    async GetallvendorPosts(): Promise<IVendorPostResponse[]>{
        return await this.customerservice.getAllPosts()
    }

    @Get('search/vendors')
async searchVendors(@Query('keyword') keyword: string,) {
  try {
    
      return await this.customerservice.searchVendors(keyword);
  } catch (error) {
    throw error
    
  }
}

@Get('search/vendorniche')
async searchVendorNiche(@Query('keyword') keyword: string,) {
  try {
    
      return await this.customerservice.searchVendorsNiche(keyword);
  } catch (error) {
    throw error
    
  }
}

@Patch("/upload/:customerid")
@UseInterceptors(FileInterceptor('file'))
async updatePostPhoto(
  @Param('customerid') customerid: string,
  @UploadedFile() file: Express.Multer.File,
):Promise<{message:string}>{
  const filename = await this.fileuploadservice.uploadFile(file);
  const upload = await this.customerservice.updateProfilePics( filename,customerid,);
  return { message: ` file  uploaded successfully.` }
}


}