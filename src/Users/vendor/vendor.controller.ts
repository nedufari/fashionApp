import { Body, Controller, Param, Post } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { VendorMakePostDto } from "./vendor.dto";
import { IVendorPostResponse } from "../../Entity/Posts/vendor.post.entity";

@Controller('vendor')
export class VendorController{
    constructor(private readonly vendorservice:VendorService){}

    @Post('makepost/:vendorid/:modelid/:photographerid:/cvnmodel/:cvnphotographer/:')
    async MakePost(@Body()postdto: VendorMakePostDto, @Param("vendorid")vendorid: string, @Param("modelid")modelid: string, @Param("photographerid")photographerid: string, @Param("cvnmodel")cvnmodel: string, @Param("cvnphotographer")cvnphotographer: string):Promise<IVendorPostResponse>{
        const post =await this.vendorservice.makepost(postdto,vendorid,modelid,photographerid,cvnmodel,cvnphotographer)
        return post
    }
}
