import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { FashionDesignerService } from "./fashiondesigner.service";
import { UpdateFashionDesignerDto } from "./fashiodesignerdto";
import { FashionDesignerEntity } from "../Entity/users/fashiodesigner.entity";
import { PhotographerEntity } from "../Entity/users/photographers.entity";
import { FashionModelsEntity } from "../Entity/users/BrandModelsUsers/fashionmodels.entity";
import { FootwearModelsEntity } from "../Entity/users/BrandModelsUsers/footwaremodels.entity";
import { HairModelsEntity } from "../Entity/users/BrandModelsUsers/hairmodels.entity";
import { KidsModelsEntity } from "../Entity/users/BrandModelsUsers/kidsmodels.entity";
import { SkincareModelsEntity } from "../Entity/users/BrandModelsUsers/skincaremodels.entity";
import { MakeUpModelsEntity } from "../Entity/users/BrandModelsUsers/makeupmodels.entity";
import { ContractDto } from "../contract/cotracts.dto";
import { Contracts } from "../Entity/Actions/contracts.entity";

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


    @Get("footwearmodels")
    async searchfashion(@Query('keyword')query:string):Promise<FootwearModelsEntity[]>{
        return await this.fashiondesignerservice.searchfootwearmodels(query)
    }

    
    @Get('allfootwearmodels')
    async findallfootwaremodels():Promise<FootwearModelsEntity[]>{
        return await this.fashiondesignerservice.searchallfootwearmodels()
    }

    @Get("hairmodels")
    async searchhairmodels(@Query('keyword')query:string):Promise<HairModelsEntity[]>{
        return await this.fashiondesignerservice.searchhairmodels(query)
    }

    
    @Get('allhairmodels')
    async findallhairemodels():Promise<HairModelsEntity[]>{
        return await this.fashiondesignerservice.searchallhairmodels()
    }


    @Get("kidsmodels")
    async searchkidsmodels(@Query('keyword')query:string):Promise<KidsModelsEntity[]>{
        return await this.fashiondesignerservice.searchkidsmodels(query)
    }

    
    @Get('allkidsmodels')
    async findallkidsmodels():Promise<KidsModelsEntity[]>{
        return await this.fashiondesignerservice.searchallkidsmodels()
    }


    @Get("skincaremodels")
    async searchskincaremodels(@Query('keyword')query:string):Promise<SkincareModelsEntity[]>{
        return await this.fashiondesignerservice.searchskincaresmodels(query)
    }

    
    @Get('allskincaremodels')
    async findallskincaremodels():Promise<SkincareModelsEntity[]>{
        return await this.fashiondesignerservice.searchallskincaremodels()
    }


    @Get("makeupmodels")
    async searchmakeupmodels(@Query('keyword')query:string):Promise<MakeUpModelsEntity[]>{
        return await this.fashiondesignerservice.searchmakupmodels(query)
    }

    
    @Get('allmakeupmodels')
    async findallmakeupodels():Promise<MakeUpModelsEntity[]>{
        return await this.fashiondesignerservice.searchallmakeupmodels()
    }

    //contracts

    @Post("contracts/")
    async createContract(
      @Body() contractDto: ContractDto,
      @Param("mogul")mogul: FashionDesignerEntity,
      @Param("model")model: FashionModelsEntity | FootwearModelsEntity | KidsModelsEntity | SkincareModelsEntity | HairModelsEntity | MakeUpModelsEntity,
      @Param("photographer")photographer: PhotographerEntity,
    ) {
      const contract = await this.fashiondesignerservice.contract(mogul, model, photographer, contractDto);
      return { message: 'Contract created successfully', contract };
    }
    
}