import { Body, Controller, Delete, ForbiddenException, Get, Param,ParseUUIDPipe,Patch,Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ModelService } from "./model.service";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";
import { IVendorPostResponse, IvndorPostResponseWithComments } from "../../Entity/Posts/vendor.post.entity";
import { AddInterestsDto, ModelPortfolioDto, ModelTimelineDto } from "./model.dto";
import { IModelResponse } from "./model.interface";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { IModelTimeLineResponse } from "../../Entity/Posts/model.timeline.entity";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";
import { JwtGuard } from "../../auth/guards/jwt.guards";
import { UploadService } from "../../uploads.service";

@UseGuards(JwtGuard)
@Controller('model')

export class ModelController{
    constructor(private readonly modelservice:ModelService,
        private readonly fileuploadservice:UploadService){}

    @Get('myoffers/:model')
    async findmyoffers(@Param('model')model:string,@Req()request):Promise<ContractsOfffer[]>{
        const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
    //     if (userIdFromToken !== model) {
    //     throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    // }
        return await this.modelservice.getMyoffers(model)
    }

    @Get('mycounteroffers/:model')
    async findmyCounteroffers(@Param('model')model:string,@Req()request):Promise<CounterContractsOfffer[]>{
        const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
        if (userIdFromToken !== model) {
        throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
        return await this.modelservice.getMyCounteroffers(model)
    }

    @Get('notification/:model')
    async findmyNotifications(@Param('model')model:string,@Req()request):Promise<INotificationResponse[]>{
        const userIdFromToken = await request.user.id; 
        console.log(request.user.email)
    
        if (userIdFromToken !== model) {
        throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
        return await this.modelservice.getMyNotifications(model)
    }

    @Post('Interests/:model')
  async addlines(@Param('model')model:string,@Body()dto:AddInterestsDto,@Req()request){
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== model) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
}
      return await this.modelservice.AddInterests(model,dto)
  }

@Get('vendorposts')
async GetallvendorPosts(): Promise<IvndorPostResponseWithComments[]>{
    return await this.modelservice.getAllPosts()
}


@Patch('adult/portfolio/:modelid')
async ModelPortfolio(@Body()dto:ModelPortfolioDto,@Param('modelid')modelid:string,@Req() request):Promise<IModelResponse>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)
    
    if (userIdFromToken !== modelid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    return await this.modelservice.createPortfolio(modelid,dto)
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
    // Check if the user is trying to perform the action on their own account
    if (userIdFromToken !== modelid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }

  const filename = await this.fileuploadservice.uploadFile(file);
  const upload = await this.modelservice.updateProfilePics( filename,modelid,);
  return { message: ` file  uploaded successfully.` }
}


@Post('timeline/:modelid/',)
@UseInterceptors(FilesInterceptor("media", 10))
async CreateTimeline(@Param('modelid') modelid: string, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@Req()request): Promise<IModelTimeLineResponse> {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== modelid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
}
  const post = await this.modelservice.createAtimeline(timelinedto,modelid,mediaFiles);
  return post;
}

@Patch('update-timeline/:modelid/:timelineid',)
@UseInterceptors(FilesInterceptor("media", 10))
async UpdatePost(@Param('modelid') modelid: string,@Param('timelineid') timelineid: number, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[],@Req()request): Promise<IModelTimeLineResponse> {
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== modelid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
}
  const post = await this.modelservice.UpdateAtimeline(timelinedto,timelineid,modelid,mediaFiles);
  return post;
}

@Get('mytimelines/:modelid')
async getMytimelines(@Param('modelid',ParseUUIDPipe)modelid:string,@Req()request):Promise<IModelTimeLineResponse[]>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== modelid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
}
    return await this.modelservice.mytimeLines(modelid)
}

@Delete('takedown-timeline/:modelid/:timelineid')
async takedowntimeline(@Param('modelid')modelid:string,@Param('timelineid')timelineid:number,@Req()request):Promise<{message:string}>{
    const userIdFromToken = await request.user.id; 
    console.log(request.user.email)

    if (userIdFromToken !== modelid) {
    throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
}
    return await this.modelservice.TakedownTimeline(modelid,timelineid)
    
}

}
