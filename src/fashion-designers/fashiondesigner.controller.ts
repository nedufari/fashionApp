import { Body, Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { FashionDesignerService } from "./fashiondesigner.service";
import { UpdateFashionDesignerDto } from "./fashiodesignerdto";
import { FashionDesignerEntity } from "../Entity/users/fashiodesigner.entity";
import { PhotographerEntity } from "../Entity/users/photographers.entity";
import { FashionModelsEntity } from "../Entity/users/BrandModelsUsers/fashionmodels.entity";
import { FootwearModelsEntity } from "../Entity/users/BrandModelsUsers/footwaremodels.entity";

@Controller('fashiondesigner')
export class fashiondesignercontroller{
    constructor(private fashiondesignerservice:FashionDesignerService){}

    @Patch('update/:id')
    async updatefashiondesignerinfo(@Param("id")id:string, @Body()dto:UpdateFashionDesignerDto){
        return await this.fashiondesignerservice.updateFashionDesigner(dto,id)
    }


    //admin privilages 

    @Delete("admin/delete/:id")
    async deletefashiondesigner(@Param("id")id:string){
        return await this.fashiondesignerservice.deletefashiondesigner(id)
    }

    @Get("admin/allfashiondesigner")
    async getallfashiondesigner():Promise<FashionDesignerEntity[]>{
        return await this.fashiondesignerservice.getallfashiondesigner()
    }

    @Get("admin/onedesigner/:id")
    async getonedesigner(@Param("id")id:string):Promise<FashionDesignerEntity>{
        return await this.fashiondesignerservice.getonefashiondesigner(id)
    }

    @Get("admin/moguls")
    async searchmoguls(@Query('keyword')query:string):Promise<FashionDesignerEntity>{
        return await this.fashiondesignerservice.searchfashionmoguls(query)
    }

   
    //fashiondesigner privilages 

    @Get("photogrphers")
    async searchebyphotographers(@Query('keyword')query:string):Promise<PhotographerEntity[]>{
        return await this.fashiondesignerservice.searchforphotographers(query)
    }

    
    @Get('allphotographer')
    async findallphotographer():Promise<PhotographerEntity[]>{
        return await this.fashiondesignerservice.searchallphotographers()
    }


    @Get("fashionmodels")
    async searchebyfashionmodels(@Query('keyword')query:string):Promise<FashionModelsEntity[]>{
        return await this.fashiondesignerservice.searchfashionmodels(query)
    }

    
    @Get('allfashionmodels')
    async findallfashionmodels():Promise<FashionModelsEntity[]>{
        return await this.fashiondesignerservice.searchallfashionmodels()
    }


    @Get("fashionmodels")
    async searchfashion(@Query('keyword')query:string):Promise<FootwearModelsEntity[]>{
        return await this.fashiondesignerservice.searchfootwearmodels(query)
    }

    
    @Get('allfashionmodels')
    async findallfootwaremodels():Promise<FashionModelsEntity[]>{
        return await this.fashiondesignerservice.searchallfashionmodels()
    }


    
}