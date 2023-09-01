import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common"

import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerService } from "./photo.service";
import { IVendorPostResponse } from "../../Entity/Posts/vendor.post.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IPhotographerTimeLineResponse } from "../../Entity/Posts/photographer.timeline.entity";
import { ModelTimelineDto } from "../model/model.dto";
import { PhotographerUpdatePostDto, UpdatePhotographerDataDto } from "./photo.dto";
import { IPhotographerResponse } from "./photo.interface";
import { INotificationResponse } from "../../Entity/Notification/notification.entity";

@Controller('photographer')
export class PhotographerController{
    constructor(private readonly photoservice:PhotographerService){}

    @Get('myoffers/:photo')
    async findmyoffers(@Param('photo')photo:string):Promise<ContractsOfffer[]>{
        return await this.photoservice.getMyoffers(photo)
    }

    @Get('mycounteroffers/:photo')
    async findmyCounteroffers(@Param('photo')photo:string):Promise<CounterContractsOfffer[]>{
        return await this.photoservice.getMyCounteroffers(photo)
    }

    @Get('vendorposts')
    async GetallvendorPosts(): Promise<IVendorPostResponse[]>{
    return await this.photoservice.getAllPosts()
}

@Post('timeline/:modelid/',)
@UseInterceptors(FilesInterceptor("media", 10))
async CreateTimeline(@Param('modelid') modelid: string, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IPhotographerTimeLineResponse> {
  const post = await this.photoservice.createAtimeline(timelinedto,modelid,mediaFiles);
  return post;
}

@Patch('update-timeline/:modelid/:timelineid',)
@UseInterceptors(FilesInterceptor("media", 10))
async UpdatePost(@Param('modelid') modelid: string,@Param('timelineid') timelineid: number, @Body() timelinedto: ModelTimelineDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IPhotographerTimeLineResponse> {
  const post = await this.photoservice.UpdateAtimeline(timelinedto,timelineid,modelid,mediaFiles);
  return post;
}

@Get('mytimelines/:modelid')
async getMytimelines(@Param('modelid',ParseUUIDPipe)modelid:string,):Promise<IPhotographerTimeLineResponse[]>{
    return await this.photoservice.mytimeLines(modelid)
}

@Get('notification/:photographer')
async findmyNotifications(@Param('photographer')photographer:string):Promise<INotificationResponse[]>{
    return await this.photoservice.getMyNotifications(photographer)
}

@Delete('takedown-timeline')
async takedowntimeline(@Param('photoid')photoid:string,@Param('timelineid')timelineid:number):Promise<{message:string}>{
    return await this.photoservice.TakedownTimeline(photoid,timelineid)
    
}

@Patch('portfolio/:modelid')
async ModelPortfolio(@Body()dto:UpdatePhotographerDataDto,@Param('modelid')modelid:string):Promise<IPhotographerResponse>{
    return await this.photoservice.createPhotographerportfolio(modelid,dto)
}
}
