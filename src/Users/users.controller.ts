// import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
// import { UserService } from "./users.service";
// import { UpdateFashionDesignerDto } from "./userdto";
// import { ContractDto } from "../contract/cotracts.dto";
// import { Contracts } from "../Entity/contracts.entity";
// import { JwtGuard } from "../auth/guards/jwt.guards";
// import { UsersEntity } from "../Entity/users";

// @Controller('user')
// export class Usercontroller{
//     constructor(private userservice:UserService){}

//     @Patch('update/:id')
//     async updatefashiondesignerinfo(@Param("id")id:string, @Body()dto:UpdateFashionDesignerDto){
//         return await this.userservice.updateUser(dto,id)
//     }


//     //admin privilages 

//     @Delete("admin/delete/:id")
//     async deletefashiondesigner(@Param("id")id:string){
//         return await this.userservice.deleteUser(id)
//     }

//     @Get("admin/alluser")
//     async getallfuser():Promise<UsersEntity[]>{
//         return await this.userservice.getallUser()
//     }

//     @Get("admin/oneuser/:id")
//     async getoneuser(@Param("id")id:string):Promise<UsersEntity>{
//         return await this.userservice.getoneUser(id)
//     }

//     // @Get("admin/search")
//     // async search(@Query('keyword')query:string):Promise<UsersEntity[]>{
//     //     return await this.userservice.search(query)
//     // }

   
  
    

// }

    
   

    
   

    
    

 

//     //contracts

//     // @UseGuards(JwtGuard)
//     // @Post("contracts/:model")
//     // async createContract(
//     //     @Req()req,
//     //   @Body() contractDto: ContractDto,
//     //   @Param("mogul")mogul: FashionDesignerEntity,
//     //   @Param("model")model: FashionModelsEntity | FootwearModelsEntity | KidsModelsEntity | SkincareModelsEntity | HairModelsEntity | MakeUpModelsEntity,
//     //   @Param("photographer")photographer: PhotographerEntity,
//     // ) {
//     //     mogul =req.user
//     //   const contract = await this.fashiondesignerservice.contract(mogul, model, photographer, contractDto);
//     //   return { message: 'Contract created successfully', contract };
//     // }
    
