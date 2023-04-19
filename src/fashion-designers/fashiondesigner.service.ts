import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FashionDesignerEntity } from '../Entity/users/fashiodesigner.entity';
import { Repository } from 'typeorm';
import { UpdateFashionDesignerDto } from './fashiodesignerdto';
import { Query } from 'express-serve-static-core';
import { OrdinaryUserEntity } from '../Entity/users/ordinaryuser.entity';
import { FashionModelRepository, FootwearModelRepository, HairModelRepository, KidsModelRepository, MakeUpModelRepository, OrdinaryUserRepository, PhotographerRepository, SkincareModelRepository } from '../auth/auth.repository';
import { PhotographerEntity } from '../Entity/users/photographers.entity';
import { FashionModelsEntity } from '../Entity/users/BrandModelsUsers/fashionmodels.entity';
import { HairModelsEntity } from '../Entity/users/BrandModelsUsers/hairmodels.entity';
import { SkincareModelsEntity } from '../Entity/users/BrandModelsUsers/skincaremodels.entity';
import { FootwearModelsEntity } from '../Entity/users/BrandModelsUsers/footwaremodels.entity';
import { KidsModelsEntity } from '../Entity/users/BrandModelsUsers/kidsmodels.entity';
import { MakeUpModelsEntity } from '../Entity/users/BrandModelsUsers/makeupmodels.entity';
import { ContractDto } from '../contract/cotracts.dto';
import { Contracts } from '../Entity/Actions/contracts.entity';
import { ContractDuration } from '../Enums/contractduration.enum';
import { add } from 'date-fns';
import { ContractRepository } from '../contract/contrct.repository';

@Injectable()
export class FashionDesignerService {
  constructor(
    @InjectRepository(FashionDesignerEntity)
    private fashiondesignerrepository: Repository<FashionDesignerEntity>,
    @InjectRepository(OrdinaryUserEntity)
    private ordnaryuserrepository: OrdinaryUserRepository,
    @InjectRepository(PhotographerEntity)
    private photographerrepository: PhotographerRepository,
    @InjectRepository(FashionModelsEntity)
    private fashionmodelrepository: FashionModelRepository,
    @InjectRepository(HairModelsEntity)
    private hairmodelrepository: HairModelRepository,
    @InjectRepository(SkincareModelsEntity)
    private skincaremodelrepository: SkincareModelRepository,
    @InjectRepository(FootwearModelsEntity)
    private footwearrepository: FootwearModelRepository,
    @InjectRepository(KidsModelsEntity)
    private kidsmodelrepository: KidsModelRepository,
    @InjectRepository(MakeUpModelsEntity)
    private makeuprepository: MakeUpModelRepository,
    @InjectRepository(Contracts)
    private contractrepository: ContractRepository,
  ) {}

  //update, delete, sign contract with models and photographers, search for models, search for photographers
  //connect with them, make sales and recieve bespoke orders too, update profile pictures

  async updateFashionDesigner(dto: UpdateFashionDesignerDto, id: string) {
    const finduser = await this.fashiondesignerrepository.findOne({
      where: { id: id },
      select: ['email', 'id'],
    });
    if (!finduser)
      throw new HttpException(
        `the user with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    const updateuser = await this.fashiondesignerrepository.update(id, dto);
    return updateuser;
  }

  //admin functionalities on the fashion designer kind of user 

  async deletefashiondesigner(id: string) {
    const finduser = await this.fashiondesignerrepository.delete(id);
    if (!finduser.affected)
      throw new HttpException(
        `the user with id ${id}is not found`,
        HttpStatus.NOT_FOUND,
      );
    return HttpStatus.NO_CONTENT;
  }

  async getallfashiondesigner(): Promise<FashionDesignerEntity[]> {
    return await this.fashiondesignerrepository.find();
  }

  async getonefashiondesigner(id: string): Promise<FashionDesignerEntity> {
    const designer = await this.fashiondesignerrepository.findOne({
      where: { id: id },
    });
    if (!designer)
      throw new HttpException(
        `designer with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    return designer;
  }

  

  async searchfashionmoguls(
    keyword: string,
  ): Promise<FashionDesignerEntity> {
    const result = await this.fashiondesignerrepository
      .createQueryBuilder('FashionDesignerEntity')
      .where('FashionDesignerEntity.email ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.brandname ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .getOne()
      ;

    const count = await this.fashiondesignerrepository
      .createQueryBuilder('FashionDesignerEntity')
      .where('FashionDesignerEntity.email ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.brandname ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionDesignerEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }


/// seacrhes that can be made by the fashiondesigner

//for photographer (username, state of residence, gender)

async searchforphotographers(
    keyword: string,
  ): Promise<PhotographerEntity[]> {
    const result = await this.photographerrepository
      .createQueryBuilder('PhotographerEntity')
      .where('PhotographerEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.pricerange ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
      ;

    const count = await this.photographerrepository
      .createQueryBuilder('PhotographerEntity')
      .where('PhotographerEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('PhotographerEntity.pricerange ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }
  async searchallphotographers():Promise<PhotographerEntity[]>{
    return await this.photographerrepository.find()
  }




  //for fashionmodels

async searchfashionmodels(
    keyword: string,
  ): Promise<FashionModelsEntity[]> {
    const result = await this.fashionmodelrepository
      .createQueryBuilder('FashionModelsEntity')
      .where('FashionModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.height_in_ft ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
      ;

    const count = await this.fashionmodelrepository
      .createQueryBuilder('FashionModelsEntity')
      .where('FashionModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.height_in_ft ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FashionModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }

  async searchallfashionmodels():Promise<FashionModelsEntity[]>{
    return await this.fashionmodelrepository.find()
  }



    //for footwearmodel

async searchfootwearmodels(
    keyword: string,
  ): Promise<FootwearModelsEntity[]> {
    const result = await this.footwearrepository
      .createQueryBuilder('FootwearModelsEntity')
      .where('FootwearModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
      ;

    const count = await this.footwearrepository
      .createQueryBuilder('FootwearModelsEntity')
      .where('FootwearModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('FootwearModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }

  async searchallfootwearmodels():Promise<FootwearModelsEntity[]>{
    return await this.footwearrepository.find()
  }

   //for hairmodel

   async searchhairmodels(
    keyword: string,
  ): Promise<HairModelsEntity[]> {
    const result = await this.hairmodelrepository
      .createQueryBuilder('HairModelsEntity')
      .where('HairModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntityy.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
      ;

    const count = await this.hairmodelrepository
      .createQueryBuilder('HairModelsEntity')
      .where('HairModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('HairModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }

  async searchallhairmodels():Promise<HairModelsEntity[]>{
    return await this.hairmodelrepository.find()
  }


  
   //for kidsmodel

   async searchkidsmodels(
    keyword: string,
  ): Promise<KidsModelsEntity[]> {
    const result = await this.kidsmodelrepository
      .createQueryBuilder('KidsModelsEntity')
      .where('KidsModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.age ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.manager ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
      ;

    const count = await this.kidsmodelrepository
      .createQueryBuilder('KidsModelsEntity')
      .where('KidsModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.age ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.manager ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('KidsModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
      .getCount();
      
      if (count === 0) {
        throw new NotFoundException(`No search results found for query "${keyword}"`);
      }

    return result;
  }

  async searchallkidsmodels():Promise<KidsModelsEntity[]>{
    return await this.kidsmodelrepository.find()
  }




     //for skicaremodels

     async searchskincaresmodels(
        keyword: string,
      ): Promise<SkincareModelsEntity[]> {
        const result = await this.skincaremodelrepository
          .createQueryBuilder('SkincareModelsEntity')
          .where('SkincareModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
          .getMany()
          ;
    
        const count = await this.skincaremodelrepository
          .createQueryBuilder('SkincareModelsEntity')
          .where('SkincareModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('SkincareModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
          
          .getCount();
          
          if (count === 0) {
            throw new NotFoundException(`No search results found for query "${keyword}"`);
          }
    
        return result;
      }
    
      async searchallskincaremodels():Promise<SkincareModelsEntity[]>{
        return await this.skincaremodelrepository.find()
      }




       //for makeup

     async searchmakupmodels(
        keyword: string,
      ): Promise<MakeUpModelsEntity[]> {
        const result = await this.makeuprepository
          .createQueryBuilder('MakeUpModelsEntity')
          .where('MakeUpModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
          .getMany()
          ;
    
        const count = await this.makeuprepository
          .createQueryBuilder('MakeUpModelsEntity')
          .where('MakeUpModelsEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.state_of_residence ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.address ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('MakeUpModelsEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
          
          .getCount();
          
          if (count === 0) {
            throw new NotFoundException(`No search results found for query "${keyword}"`);
          }
    
        return result;
      }
    
      async searchallmakeupmodels():Promise<MakeUpModelsEntity[]>{
        return await this.makeuprepository.find()
      }


      //contract
      //date, designer, photographer, models, contract type, amount agreed, duration, expirationday, contractststus 



      async contract(mogul: FashionDesignerEntity, model: FashionModelsEntity | FootwearModelsEntity | KidsModelsEntity | SkincareModelsEntity | HairModelsEntity | MakeUpModelsEntity, photographer: PhotographerEntity, contractdto: ContractDto): Promise<Contracts> {
        const contract = new Contracts();
        contract.fashion_mogul = mogul;
        contract.fashion_model = model;
        contract.photographer = photographer;
        contract.contract_worth = contractdto.contract_worth;
        contract.contract_duration = contractdto.contract_duration;
        contract.commence_date = new Date();
        contract.expiration_date = this.expirationdateforcontract(contract.commence_date, contract.contract_duration);
        return await this.contractrepository.save(contract);
      }


      private expirationdateforcontract(startdate:Date, duration:ContractDuration):Date{

        const startDateObj = new Date(startdate);
        if (!(startDateObj instanceof Date && !isNaN(startDateObj.getTime()))) {
          throw new HttpException(`invalid start date ${startdate}`, HttpStatus.BAD_REQUEST);
        }

        let monthtoadd:number
        switch(duration){
            case ContractDuration.ONE_MONTH:
                monthtoadd=1
                break;
            case ContractDuration.THREE_MONTHS:
                monthtoadd=3
                break;
            case ContractDuration.SIX_MONTHS:
                monthtoadd=6
                break;
            case ContractDuration.ONE_YEAR:
                monthtoadd=12
                break;
            default:
                throw new HttpException(`invalid duration ${duration}`,HttpStatus.BAD_REQUEST)
        }
        return add(startdate,{months:monthtoadd})
       
      }
}
