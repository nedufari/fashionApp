import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AddLinesDto, VendorMakePostDto } from './vendor.dto';
import { IVendorPostResponse } from '../../Entity/Posts/vendor.post.entity';
import { ContractsOfffer } from '../../Entity/contractoffer.entity';
import { CounterContractsOfffer } from '../../Entity/countercontractOffer.entity';
import { IVendorResponse } from './vendor.interface';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorservice: VendorService) {}

  @Post(
    'makepost/:vendorid/',
  )
  async MakePost(@Param('vendorid') vendorid: string, @Body() postdto: VendorMakePostDto,): Promise<IVendorPostResponse> {
    const post = await this.vendorservice.makepost(postdto,vendorid,);
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

  // @Get('myposts')
  // async findmyPosts():Promise<IVendorPostResponse[]>{
  //     return await this.vendorservice.getMyposts()
  // }

  @Post('lines/:vendor')
  async addlines(@Param('vendor')vendor:string,dto:AddLinesDto):Promise<IVendorResponse>{
      return await this.vendorservice.SelectLines(vendor,dto)
  }

}
