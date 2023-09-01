import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import {  AddLinesDto, UpdateVendorDataDto, VendorMakePostDto, VendorUpdatePostDto } from './vendor.dto';
import { IVendorPostResponse } from '../../Entity/Posts/vendor.post.entity';
import { ContractsOfffer } from '../../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { IVendorResponse } from './vendor.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { INotificationResponse } from '../../Entity/Notification/notification.entity';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorservice: VendorService) {}

  @Post('makepost/:vendorid/',)
  @UseInterceptors(FilesInterceptor("media", 10))
  async MakePost(@Param('vendorid') vendorid: string, @Body() postdto: VendorMakePostDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IVendorPostResponse> {
    const post = await this.vendorservice.makepost(postdto,vendorid,mediaFiles);
    return post;
  }

  @Patch('updatepost/:vendorid/:postid',)
  @UseInterceptors(FilesInterceptor("media", 10))
  async UpdatePost(@Param('vendorid') vendorid: string,@Param('postid') postid: number, @Body() postdto: VendorUpdatePostDto,@UploadedFiles() mediaFiles: Express.Multer.File[]): Promise<IVendorPostResponse> {
    const post = await this.vendorservice.Updateepost(postdto,vendorid,postid,mediaFiles);
    return post;
  }

  
  @Get('myoffers/:vendor')
  async findmyoffers(@Param('vendor')vendor:string):Promise<ContractsOfffer[]>{
      return await this.vendorservice.getMyoffers(vendor)
  }

  @Get('mycounteroffers/:vendor')
  async findmyCounteroffers(@Param('vendor')vendor:string):Promise<CounterContractsOfffer[]>{
      return await this.vendorservice.getMyCounteroffers(vendor)
  }

  @Get('notification/:vendor')
  async findmyNotifications(@Param('vendor')vendor:string):Promise<INotificationResponse[]>{
      return await this.vendorservice.getMyNotifications(vendor)
  }

  @Get('myposts/:vendorid')
  async findmyPosts(@Param('vendorid', ParseUUIDPipe) vendorId: string,):Promise<IVendorPostResponse[]>{
      return await this.vendorservice.getVendorPosts(vendorId)
  }

  @Patch('update/:vendor')
  async updateVendor(@Param('vendor')vendor:string,@Body()dto:UpdateVendorDataDto):Promise<IVendorResponse>{
      return await this.vendorservice.UpdateVendor(vendor,dto)
  }

  @Patch('niche/:vendor')
  async addlines(@Param('vendor')vendor:string,@Body()dto:AddLinesDto):Promise<IVendorResponse>{
      return await this.vendorservice.niche(vendor,dto)
  }

  @Get('vendorposts')
  async GetallvendorPosts(): Promise<IVendorPostResponse[]>{
    return await this.vendorservice.getAllPosts()
}


  @Delete('deletepost/:vendorid/:id')
  async DeletevendorPosts(@Param('vendorid')vendorid:string,@Param('id')id:number): Promise<{message:string}>{
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

}
