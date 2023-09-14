import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import {  SuperAdminService } from "./superAdmin.service";
import { ChangeAdmintypeDto, CreateAdminDto, UpgradeClearanceLevelDto } from "./admin.dto";
import { RolesGuard } from "../../auth/guards/role.guards";
import { Role } from "../../auth/decorator/roles.decorators";
import { AdminTypes } from "../../Enums/roles.enum";
import { JwtGuard } from "../../auth/guards/jwt.guards";
import { IAdminChangePassword, IChangeAdminType, ICreateOtherAdmin, IUpgradeAdminClearanceLevel } from "./admin.interface";

@UseGuards(JwtGuard)
@Controller('admin-type')
export class SuperAdmincontroller{
    constructor(private readonly admintypeservice:SuperAdminService){}

    @UseGuards(RolesGuard)
    @Role(AdminTypes.SUPER_ADMIN)
    @Post('create-new/:id')
    async CretaenewAdmin(@Param('id')id:string,@Body()dto:CreateAdminDto,@Req()request):Promise<ICreateOtherAdmin>{
        const newAdmin = await this.admintypeservice.CreateAnyAdminKind(id,dto)
       const user = request.user.id
       console.log(request.user.email)

        return newAdmin
    }

    @UseGuards(RolesGuard)
    @Role(AdminTypes.SUPER_ADMIN)
    @Patch('upgrade-clearancelevel/:id/:adminid')
    async upgradeAdminClearance(@Param('id')id:string,@Param('adminid')adminid:string,@Body()dto:UpgradeClearanceLevelDto,@Req()request):Promise<{message:string,response:IUpgradeAdminClearanceLevel}>{
        const newAdmin = await this.admintypeservice.UpgradeAdminClearanceLevel(id,adminid,dto)
        return newAdmin
    }

    
    @UseGuards(RolesGuard)
    @Role(AdminTypes.SUPER_ADMIN)
    @Patch('change-admintype/:id/:adminid')
    async changeeAdminType(@Param('id')id:string,@Param('adminid')adminid:string,@Body()dto:ChangeAdmintypeDto,@Req()request):Promise<{message:string,response:IChangeAdminType}>{
        const newAdmin = await this.admintypeservice.UpgradeAdminType(id,adminid,dto)
        return newAdmin
    }

    @UseGuards(RolesGuard)
    @Role(AdminTypes.SUPER_ADMIN)
    @Patch('change-adminpassword/:id/:adminid')
    async changeAdminPassword(@Param('id')id:string,@Param('adminid')adminid:string,@Req()request):Promise<{message:string,response:IAdminChangePassword}>{
        const newAdmin = await this.admintypeservice.AdminChangeotherAdmiPassword(id,adminid,)
        return newAdmin
    }

    @UseGuards(RolesGuard)
    @Role(AdminTypes.SUPER_ADMIN)
    @Delete('deleteAdmin/:id/:adminid')
    async AdminDeleteOtherAdmin(@Param('id')id:string,@Param('adminid')adminid:string,@Req()request):Promise<{message:string}>{
        const newAdmin = await this.admintypeservice.AdminDeleteAdmin(id,adminid)
        return newAdmin
    }





}