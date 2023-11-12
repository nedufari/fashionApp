import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"

import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerService } from "./photo.service";
import { IVendorPostResponse, IvndorPostResponseWithComments } from "../../Entity/Posts/vendor.post.entity";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { IPhotographerTimeLineResponse } from "../../Entity/Posts/photographer.timeline.entity";
import { ModelTimelineDto } from "../model/model.dto";
import { PhotographerUpdatePostDto, UpdatePhotographerDataDto } from "./photo.dto";
import { IPhotographerResponse } from "./photo.interface";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";
import { UploadService } from "../../uploads.service";
import { JwtGuard } from "../../auth/guards/jwt.guards";
import { LayComplaintDto } from "../../sharedDto/complaints.dto";

@UseGuards(JwtGuard)
@Controller('photographer')
export class PhotographerController{
    constructor(private readonly photoservice:PhotographerService,
        private readonly fileuploadservice:UploadService){}

    @Get('myoffers/:photo')
    async findmyoffers(@Param('photo')photo:string,@Req()request):Promise<ContractsOfffer[]>{
        const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
        const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photo);

        return await this.photoservice.getMyoffers(photo)
    }

    @Get('mycounteroffers/:photo')
    async findmyCounteroffers(@Param('photo')photo:string,@Req()request):Promise<CounterContractsOfffer[]>{
        const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
        const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photo);

        return await this.photoservice.getMyCounteroffers(photo)
    }

    @Get('vendorposts')
    async GetallvendorPosts(): Promise<IvndorPostResponseWithComments[]>{
    return await this.photoservice.getAllPosts()
}

@Post('timeline/:photolid/',)
@UseInterceptors(FilesInterceptor("media", 10))
async CreateTimeline(@Param('photoid') photoid: string, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@Req()request): Promise<IPhotographerTimeLineResponse> {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photoid);

  const post = await this.photoservice.createAtimeline(timelinedto,photoid,mediaFiles);
  return post;
}

@Patch('update-timeline/:photoid/:timelineid',)
@UseInterceptors(FilesInterceptor("media", 10))
async UpdatePost(@Param('photoid') photoid: string,@Param('timelineid') timelineid: number, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@Req()request): Promise<IPhotographerTimeLineResponse> {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photoid);

  const post = await this.photoservice.UpdateAtimeline(timelinedto,timelineid,photoid,mediaFiles);
  return post;
}

@Get('mytimelines/:photoid')
async getMytimelines(@Param('photoid',ParseUUIDPipe)photoid:string,@Req()request):Promise<IPhotographerTimeLineResponse[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photoid);

    return await this.photoservice.mytimeLines(photoid)
}

@Get('notification/:photographer')
async findmyNotifications(@Param('photographer')photographer:string,@Req()request):Promise<INotificationResponse[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

        const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photographer);

    return await this.photoservice.getMyNotifications(photographer)
}

@Delete('takedown-timeline/:photoid')
async takedowntimeline(@Param('photoid')photoid:string,@Param('timelineid')timelineid:number,@Req()request):Promise<{message:string}>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photoid);

    return await this.photoservice.TakedownTimeline(photoid,timelineid)
    
}

@Patch('portfolio/:photoid')
async ModelPortfolio(@Body()dto:UpdatePhotographerDataDto,@Param('photoid')photoid:string,@Req()request):Promise<IPhotographerResponse>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

      const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, photoid);

    return await this.photoservice.createPhotographerportfolio(photoid,dto)
}

@Patch("/upload/:modelid")
@UseInterceptors(FileInterceptor('file'))
async updateProfilePhoto(
  @Param('modelid') modelid: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() request,
):Promise<{message:string}>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, modelid)
  const filename = await this.fileuploadservice.uploadFile(file);
  const upload = await this.photoservice.updateProfilePics( filename,modelid,);
  return { message: ` file  uploaded successfully.` }
}


@Post('complaint/:customerid')
@UseInterceptors(FileInterceptor('file'))
async createComplaint(@Param('customerid') customerid: string,@Body() complaintDto: LayComplaintDto,@UploadedFile() file: Express.Multer.File,@Req()request) :Promise<{issueID:string, message:string}>{
  try {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    const accessGranted = await this.handleThirdLevelAuth(userIdFromToken, customerid);

    // Call the service to handle the complaint
    const filename = await this.fileuploadservice.uploadFile(file);
    const response = await this.photoservice.handleComplaint(customerid, complaintDto,filename);
    return response;
  } catch (error) {
   
    throw error;
  }
}

async handleThirdLevelAuth(userIdFromToken: string,customerid: string):Promise<boolean>{
  if (userIdFromToken !== customerid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    return true;
}
}
