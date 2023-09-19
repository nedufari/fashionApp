import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CustomerService } from "./customers.service";
import { ICustomerCommentResponse } from "../../Entity/Activities/comment.entity";
import { CustomerMakeCommentDto, CustomerReplyDto, LikeDto } from "./customers.dto";
import { ICustomerReplyResponse } from "../../Entity/Activities/reply.entity";
import { IVendorPostResponse, IvndorPostResponseWithComments } from "../../Entity/Posts/vendor.post.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "../../uploads.service";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";
import { JwtGuard } from "../../auth/guards/jwt.guards";
// import { CustomerComplaintService } from "./customer.complain.service";
import { ComplaintDto, LayComplaintDto } from "../../sharedDto/complaints.dto";

@UseGuards(JwtGuard)
@Controller('customer')
export class CustomerControlller{
    constructor(private readonly customerservice:CustomerService,
      private readonly fileuploadservice:UploadService,
      ){}

    @Post('comment/:postid/:customerid')
    async MakePost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:CustomerMakeCommentDto,@Req()request):Promise<ICustomerCommentResponse>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.customerservice.makeComment(postid,customerid,dto)
    }

    @Post('reply/:commentid/:customerid')
    async ReplyComment(@Param('commentid')commentid:number,@Param('customerid')customerid:string,@Body()dto:CustomerReplyDto,@Req()request):Promise<ICustomerReplyResponse>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.customerservice.replycomment(commentid,customerid,dto)
    }

    @Post('like/:postid/:customerid')
    async likeaPost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:LikeDto,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.customerservice.likeAPost(postid,customerid,dto)
    }

    @Get('notification/:customer')
    async findmyNotifications(@Param('customer')customer:string,@Req()request):Promise<INotificationResponse[]>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customer) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.customerservice.getMyNotifications(customer)
    }

    @Post('dislike/:postid/:customerid')
    async dislikeaPost(@Param('postid')postid:number,@Param('customerid')customerid:string,@Body()dto:LikeDto,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.customerservice.DislikeAPost(postid,customerid,dto)
    }

    @Get('vendorposts')
    async GetallvendorPosts(): Promise<IvndorPostResponseWithComments[]>{
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
async updateProfilePhoto(
  @Param('customerid') customerid: string,
  @UploadedFile() file: Express.Multer.File,
  @Req()request
):Promise<{message:string}>{
  const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
  const filename = await this.fileuploadservice.uploadFile(file);
  const upload = await this.customerservice.updateProfilePics( filename,customerid,);
  return { message: ` file  uploaded successfully.` }
}


@Post('complaint/:customerid')
@UseInterceptors(FileInterceptor('file'))
async createComplaint(@Param('customerid') customerid: string,@Body() complaintDto: LayComplaintDto,@UploadedFile() file: Express.Multer.File,@Req()request) :Promise<{issueID:string, message:string}>{
  try {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== customerid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    // Call the service to handle the complaint
    const filename = await this.fileuploadservice.uploadFile(file);
    const response = await this.customerservice.handleComplaint(customerid, complaintDto,filename);
    return response;
  } catch (error) {
   
    throw error;
  }
}

}