import { Body, Controller, Delete, ForbiddenException, Get, Param,ParseUUIDPipe,Patch,Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ModelService } from "./model.service";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";
import { IVendorPostResponse } from "../../Entity/Posts/vendor.post.entity";
import { AddInterestsDto, ModelPortfolioDto, ModelTimelineDto } from "./model.dto";
import { IModelResponse } from "./model.interface";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IModelTimeLineResponse } from "../../Entity/Posts/model.timeline.entity";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";
import { JwtGuard } from "../../auth/guards/jwt.guards";

@Controller('model')
@UseGuards(JwtGuard)
export class ModelController{
    constructor(private readonly modelservice:ModelService){}

    @Get('myoffers/:model')
    async findmyoffers(@Param('model')model:string):Promise<ContractsOfffer[]>{
        return await this.modelservice.getMyoffers(model)
    }

    @Get('mycounteroffers/:model')
    async findmyCounteroffers(@Param('model')model:string):Promise<CounterContractsOfffer[]>{
        return await this.modelservice.getMyCounteroffers(model)
    }

    @Get('notification/:model')
    async findmyNotifications(@Param('model')model:string):Promise<INotificationResponse[]>{
        return await this.modelservice.getMyNotifications(model)
    }

    @Post('Interests/:vendor')
  async addlines(@Param('vendor')vendor:string,@Body()dto:AddInterestsDto){
      return await this.modelservice.AddInterests(vendor,dto)
  }

@Get('vendorposts')
async GetallvendorPosts(): Promise<IVendorPostResponse[]>{
    return await this.modelservice.getAllPosts()
}

@UseGuards(JwtGuard)
@Patch('adult/portfolio/:modelid')
async ModelPortfolio(@Body()dto:ModelPortfolioDto,@Param('modelid')modelid:string,@Req() request):Promise<IModelResponse>{
    const userIdFromToken = await request.user.id; 
    console.log(userIdFromToken)

    // Check if the user is trying to perform the action on their own account
    if (userIdFromToken !== modelid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
    }
    return await this.modelservice.createPortfolio(modelid,dto)
}


@Post('timeline/:modelid/',)
@UseInterceptors(FilesInterceptor("media", 10))
async CreateTimeline(@Param('modelid') modelid: string, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IModelTimeLineResponse> {
  const post = await this.modelservice.createAtimeline(timelinedto,modelid,mediaFiles);
  return post;
}

@Patch('update-timeline/:modelid/:timelineid',)
@UseInterceptors(FilesInterceptor("media", 10))
async UpdatePost(@Param('modelid') modelid: string,@Param('timelineid') timelineid: number, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IModelTimeLineResponse> {
  const post = await this.modelservice.UpdateAtimeline(timelinedto,timelineid,modelid,mediaFiles);
  return post;
}

@Get('mytimelines/:modelid')
async getMytimelines(@Param('modelid',ParseUUIDPipe)modelid:string,):Promise<IModelTimeLineResponse[]>{
    return await this.modelservice.mytimeLines(modelid)
}

@Delete('takedown-timeline/:photoid/:timelineid')
async takedowntimeline(@Param('photoid')photoid:string,@Param('timelineid')timelineid:number):Promise<{message:string}>{
    return await this.modelservice.TakedownTimeline(photoid,timelineid)
    
}

}
