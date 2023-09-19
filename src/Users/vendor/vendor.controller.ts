import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import {  AddLinesDto, UpdateVendorDataDto, VendorMakePostDto, VendorMakePostandProductDto, VendorProductDto, VendorUpdatePostDto } from './vendor.dto';
import { IVendorPostResponse, IvndorPostResponseWithComments } from '../../Entity/Posts/vendor.post.entity';
import { ContractsOfffer } from '../../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { IVendorResponse } from './vendor.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { INotificationResponse } from '../../Entity/Notification/notification.entity';
import { JwtGuard } from '../../auth/guards/jwt.guards';
import { UploadService } from '../../uploads.service';
import { LayComplaintDto } from '../../sharedDto/complaints.dto';

@UseGuards(JwtGuard)
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorservice: VendorService,
    private readonly fileuploadservice:UploadService) {}

  @Post('makepost/:vendorid/',)
  @UseInterceptors(FilesInterceptor("media", 10))
  async MakePost(@Param('vendorid') vendorid: string, @Body() dto: VendorMakePostDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@Req()request): Promise<IVendorPostResponse> {
    const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
        if (userIdFromToken !== vendorid) {
        throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
        }
    const post = await this.vendorservice.makepost(dto,vendorid,mediaFiles);
    return post;
  }

  @Patch('updatepost/:vendorid/:postid/:productid',)
  @UseInterceptors(FilesInterceptor("media", 10))
  @UseInterceptors(FilesInterceptor("file", 3))
  async UpdatePost(@Param('vendorid') vendorid: string,@Param('postid') postid: number,@Param('productid') producttid: number, @Body() postdto: VendorUpdatePostDto,@Body() productdto: VendorProductDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@UploadedFile() productile: Express.Multer.File,@Req()request): Promise<IVendorPostResponse> {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendorid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    const post = await this.vendorservice.Updateepost(postdto,productdto,vendorid,postid,producttid,mediaFiles,productile);
    return post;
  }

  
  @Get('myoffers/:vendor')
  async findmyoffers(@Param('vendor')vendor:string,@Req()request):Promise<ContractsOfffer[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    // if (userIdFromToken !== vendor) {
    // throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    // }
      return await this.vendorservice.getMyoffers(vendor)
  }

  @Get('mycounteroffers/:vendor')
  async findmyCounteroffers(@Param('vendor')vendor:string,@Req()request):Promise<CounterContractsOfffer[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendor) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
      return await this.vendorservice.getMyCounteroffers(vendor)
  }

  @Get('notification/:vendor')
  async findmyNotifications(@Param('vendor')vendor:string,@Req()request):Promise<INotificationResponse[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendor) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
      return await this.vendorservice.getMyNotifications(vendor)
  }

  @Get('myposts/:vendorid')
  async findmyPosts(@Param('vendorid', ParseUUIDPipe) vendorId: string,@Req()request):Promise<IvndorPostResponseWithComments[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendorId) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
      return await this.vendorservice.getVendorPosts(vendorId)
  }

  @Patch('update/:vendor')
  async updateVendor(@Param('vendor')vendor:string,@Body()dto:UpdateVendorDataDto,@Req()request):Promise<IVendorResponse>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendor) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
      return await this.vendorservice.UpdateVendor(vendor,dto)
  }

  @Patch('niche/:vendor')
  async addlines(@Param('vendor')vendor:string,@Body()dto:AddLinesDto,@Req()request):Promise<IVendorResponse>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendor) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
      return await this.vendorservice.niche(vendor,dto)
  }

  @Get('vendorposts')
  async GetallvendorPosts(): Promise<IvndorPostResponseWithComments[]>{
    return await this.vendorservice.getAllPosts()
}


  @Delete('deletepost/:vendorid/:id')
  async DeletevendorPosts(@Param('vendorid')vendorid:string,@Param('id')id:number,@Req()request): Promise<{message:string}>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== vendorid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    return await this.vendorservice.deleteVendorPost(vendorid,id)
}

@Get('search/models')
async searchModels(@Query('keyword') keyword: string,) {
  try {
    
      return await this.vendorservice.search(keyword);
  } catch (error) {
    throw error
    
  }
}

@Get('search/photographers')
async searchPhotographers(@Query('keyword') keyword: string,) {
  try {
    
      return await this.vendorservice.searchPhotographers(keyword);
  } catch (error) {
    throw error
    
  }
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
    const response = await this.vendorservice.handleComplaint(customerid, complaintDto,filename);
    return response;
  } catch (error) {
   
    throw error;
  }
}

}
