import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../../Entity/Users/admin.entity';
import { AdminEntityRepository, NotificationsRepository } from '../../auth/auth.repository';
import { customAlphabet, nanoid } from 'nanoid';
import { ChangeAdmintypeDto, CreateAdminDto, UpgradeClearanceLevelDto } from './admin.dto';
import { Notifications } from '../../Entity/Notification/notification.entity';
import { NotificationType } from '../../Enums/notificationTypes.enum';
import { IAdminChangePassword, IChangeAdminType, ICreateOtherAdmin, IUpgradeAdminClearanceLevel } from './admin.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminripo: AdminEntityRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
  ) {}

  private generatePassword(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ/@*<>./(){}[]_-=+``|?', 12);
    return nanoid();
  }

  private adminid(): string {
    const nanoid= customAlphabet('1234567890',6);
    return nanoid()
  }

  //create various kinds of admins

  
  async CreateAnyAdminKind(
    id: string,
    createadmindto: CreateAdminDto,
  ): Promise<ICreateOtherAdmin> {
    try {
      const admin = await this.adminripo.findOne({ where: { id: id } });
      if (!admin)
        throw new HttpException(
          `admin with ${id} not found`,
          HttpStatus.NOT_FOUND,
        );

        const plainpassword = this.generatePassword()
        const hashedpassword = await bcrypt.hash(plainpassword,12)

      //create a password and adminid ,role, //password is auto generated
      const newAdmin = new AdminEntity();
      newAdmin.AdminID = this.adminid();
      newAdmin.password = hashedpassword
      newAdmin.created_at = new Date();
      newAdmin.AdminType = createadmindto.admintype;
      newAdmin.ClearanceLevel = createadmindto.clearanceLevel
      newAdmin.is_verified = true
      newAdmin.email = createadmindto.email


      const emailexsist = await this.adminripo.findOne({where: { email: createadmindto.email },select: ['id', 'email']});
   
      if (emailexsist)
        throw new HttpException(
          `user with email: ${createadmindto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );


      await this.adminripo.save(newAdmin);

      //response 
      const adminresponse: ICreateOtherAdmin = {
        id: newAdmin.id,
        AdminID: newAdmin.AdminID,
        email:newAdmin.email,
        AdminType :newAdmin.AdminType,
        created_at :newAdmin.created_at,
        ClearanceLevel :newAdmin.ClearanceLevel,
        password : plainpassword
        
      }

      //save the notification
      const notification = new Notifications();
      notification.account = id;
      notification.subject = 'Admin created by a super admin !';
      notification.notification_type = NotificationType.ADMIN_CREATED;
      notification.message = `a new admin has ben created as  ${newAdmin.AdminType} on walkway `;
      await this.notificationrepository.save(notification);

      return adminresponse
    } catch (error) {
      throw error;
    }
  }

  //UPGRADE THE LEVEL OF AN ADMIN 
  async UpgradeAdminClearanceLevel(id:string,adminid:string,dto:UpgradeClearanceLevelDto):Promise<{message:string; response:IUpgradeAdminClearanceLevel}>{
    try {
        const admin = await this.adminripo.findOne({ where: { id: id } });
        if (!admin)throw new HttpException(`super admin with ${id} not found`,HttpStatus.NOT_FOUND);

        const isAdmin = await this.adminripo.findOne({where:{AdminID:adminid}})
        if(!isAdmin)throw new HttpException(`the admin to be ugraded  with the id  ${adminid} is not found`,HttpStatus.NOT_FOUND);

        isAdmin.ClearanceLevel = dto.clearanceLevel
        await this.adminripo.save(isAdmin)

        //save the notification
      const notification = new Notifications();
      notification.account = isAdmin.id;
      notification.subject = 'Admin clearance level upgraded !';
      notification.notification_type = NotificationType.ADMIN_CLEARANCE_UPGRADED;
      notification.message = `the admin with id ${adminid} clearance level has been upgraded to ${dto.clearanceLevel} on the admin portal of walkway by superadmin ${admin.username} `;
      await this.notificationrepository.save(notification);

      const adminresponse : IUpgradeAdminClearanceLevel = {
        ClearanceLevel:isAdmin.ClearanceLevel
      }
        const messagerespnse =  `admin with ${adminid} have been upgraded to ${dto.clearanceLevel} by the super admin ${admin.username}`

        return {message:messagerespnse, response:adminresponse}
        
    } catch (error) {
        throw error 
        
    }

  }

    //change the admin type
    async UpgradeAdminType(id:string,adminid:string,dto:ChangeAdmintypeDto):Promise<{message:string,response:IChangeAdminType}>{
        try {
            const admin = await this.adminripo.findOne({ where: { id: id } });
            if (!admin)throw new HttpException(`super admin with ${id} not found`,HttpStatus.NOT_FOUND);
    
            const isAdmin = await this.adminripo.findOne({where:{AdminID:adminid}})
            if(!isAdmin)throw new HttpException(`the admin to be ugraded  with the id  ${adminid} is not found`,HttpStatus.NOT_FOUND);
    
            isAdmin.AdminType = dto.admintype
            await this.adminripo.save(isAdmin)
    
            //save the notification
          const notification = new Notifications();
          notification.account = isAdmin.id;
          notification.subject = 'Admin clearance level upgraded !';
          notification.notification_type = NotificationType.ADMIN_CLEARANCE_UPGRADED;
          notification.message = `the admin with id ${adminid} admintype has been changed to ${dto.admintype} on the admin portal of walkway by superadmin ${admin.username} `;
          await this.notificationrepository.save(notification);
    
          const adminresponse : IChangeAdminType = {
            AdminType:isAdmin.AdminType
          }
           const messagerespnse= `admin with ${adminid} admin type has been changed to ${dto.admintype} by the super admin ${admin.username}`

           return {message:messagerespnse, response:adminresponse}

    
            
            
        } catch (error) {
            throw error 
            
        }
}

async AdminChangeotherAdmiPassword(id:string,adminid:string):Promise<{message:string,response:IAdminChangePassword}>{

    const admin = await this.adminripo.findOne({ where: { id: id } });
    if (!admin)throw new HttpException(`super admin with ${id} not found`,HttpStatus.NOT_FOUND);

    const isAdmin = await this.adminripo.findOne({where:{AdminID:adminid}})
    if(!isAdmin)throw new HttpException(`the admin to be ugraded  with the id  ${adminid} is not found`,HttpStatus.NOT_FOUND);

    //change the password 
    isAdmin.password = this.generatePassword()
    await this.adminripo.save(isAdmin)

      //save the notification
      const notification = new Notifications();
      notification.account = isAdmin.id;
      notification.subject = 'Admin password changed !';
      notification.notification_type = NotificationType.ADMIN_PASSWORD_CHANGED;
      notification.message = `the admin with id ${adminid} password has been changed on the admin portal of walkway by superadmin ${admin.username} `;
      await this.notificationrepository.save(notification);


      const adminresponse : IAdminChangePassword = {
        password:isAdmin.password
      }
        const  messageresponse=`admin with ${adminid} password has been changed  by the super admin ${admin.username}`

        return {message:messageresponse, response:adminresponse}


}

async AdminDeleteAdmin(id:string,adminid:string):Promise<{message:string}>{

    const admin = await this.adminripo.findOne({ where: { id: id } });
    if (!admin)throw new HttpException(`super admin with ${id} not found`,HttpStatus.NOT_FOUND);

    const isAdmin = await this.adminripo.findOne({where:{AdminID:adminid}})
    if(!isAdmin)throw new HttpException(`the admin to be deleted with the id  ${adminid} is not found`,HttpStatus.NOT_FOUND);

    //delete the admin 
    await this.adminripo.remove(isAdmin)

      //save the notification
      const notification = new Notifications();
      notification.account = id && isAdmin.id;
      notification.subject = 'Admin deleted !';
      notification.notification_type = NotificationType.ADMIN_DELETED;
      notification.message = `the admin with id ${adminid}  has been deleted on the admin portal of walkway by superadmin ${admin.username} `;
      await this.notificationrepository.save(notification);

        return {message:`admin with ${adminid}  has been deleted  by the super admin ${admin.username}`}

}



}
