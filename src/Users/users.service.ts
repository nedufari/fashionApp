// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { QueryBuilder, Repository } from 'typeorm';
// import { UpdateFashionDesignerDto } from './userdto';
// import { Query } from 'express-serve-static-core';

// import { ContractDto } from '../contract/cotracts.dto';
// import { Contracts } from '../Entity/contracts.entity';
// import { ContractDuration } from '../Enums/contractDuration.enum';
// import { add } from 'date-fns';
// import { ContractRepository } from '../contract/contrct.repository';
// import { UsersEntity } from '../Entity/users';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UsersEntity)
//     private usersrepository: Repository<UsersEntity>,
//     @InjectRepository(Contracts)
//     private contractrepository: ContractRepository,
//   ) {}

//   //update, delete, sign contract with models and photographers, search for models, search for photographers
//   //connect with them, make sales and recieve bespoke orders too, update profile pictures

//   async updateUser(dto: UpdateFashionDesignerDto, id: string) {
//     const finduser = await this.usersrepository.findOne({
//       where: { id: id },
//       select: ['email', 'id'],
//     });
//     if (!finduser)
//       throw new HttpException(
//         `the user with id ${id} does not exist`,
//         HttpStatus.NOT_FOUND,
//       );
//     const updateuser = await this.usersrepository.update(id, dto);
//     return updateuser;
//   }

//   //admin functionalities on the fashion designer kind of user

//   async deleteUser(id: string) {
//     const finduser = await this.usersrepository.delete(id);
//     if (!finduser.affected)
//       throw new HttpException(
//         `the user with id ${id}is not found`,
//         HttpStatus.NOT_FOUND,
//       );
//     return HttpStatus.NO_CONTENT;
//   }

//   async getallUser(): Promise<UsersEntity[]> {
//     return await this.usersrepository.find();
//   }

//   async getoneUser(id: string): Promise<UsersEntity> {
//     const designer = await this.usersrepository.findOne({
//       where: { id: id },
//     });
//     if (!designer)
//       throw new HttpException(
//         `designer with id ${id} does not exist`,
//         HttpStatus.NOT_FOUND,
//       );
//     return designer;
//   }

//   async searchalluser(keyword: string): Promise<UsersEntity[]> {
//     const result = await this.usersrepository
//       .createQueryBuilder('UsersEntity')
//       .where('UsersEntity.email ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.brandname ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.state_of_residence ILIKE :keyword', {keyword: `%${keyword}%`,})
//       .orWhere('UsersEntity.pricerange ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.height_in_fit ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.age ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.manager ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.fullname ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.facebook ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.instagram ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.tiktok ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.snapchat ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.tiktok ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.weight_in_kg ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.fashion_genre ILIKE :keyword', { keyword: `%${keyword}%` })
//       .getMany();
//     const count = await this.usersrepository
//       .createQueryBuilder('UsersEntity')
      
//       .where('UsersEntity.email ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.name ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.brandname ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.state_of_residence ILIKE :keyword', {keyword: `%${keyword}%`,})
//       .orWhere('UsersEntity.pricerange ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.complexion ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.gender ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.height_in_fit ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.age ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.manager ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.fullname ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.username ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.facebook ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.instagram ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.tiktok ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.snapchat ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.tiktok ILIKE :keyword', { keyword: `%${keyword}%` })
//       .orWhere('UsersEntity.weight_in_kg ILIKE :keyword', { keyword: `%${keyword}%` })
      
//       .orWhere('UsersEntity.fashion_genre ILIKE :keyword', { keyword: `%${keyword}%` })
//       .getCount();

//     if (count === 0) {
//       throw new NotFoundException(
//         `No search results found for query "${keyword}"`,
//       );
//     }

//     return result;
//   }


//   async searchMultipleRecords(name: string, gender: string, height: number, state: string): Promise<UsersEntity[]> {
//     const queryBuilder: QueryBuilder<UsersEntity> = this.usersrepository.createQueryBuilder('entity');
//     if (name) {
//       queryBuilder.andWhere('entity.name = :name', { name });
//     }
//     if (gender) {
//       queryBuilder.andWhere('entity.gender = :gender', { gender });
//     }
//     if (height) {
//       queryBuilder.andWhere('entity.height = :height', { height });
//     }
//     if (state) {
//       queryBuilder.andWhere('entity.state = :state', { state });
//     }
//     const results = await queryBuilder.getMany();
//     return results;
//   }
  

  
  

  
//   // async search(keyword: string): Promise<UsersEntity[]> {
//   //   const result = await this.usersrepository
//   //     .createQueryBuilder('user')
//   //     .where('user.email ILIKE :keyword OR user.name ILIKE :keyword', {
//   //       keyword: `%${keyword}%`,
//   //     })
//   //     .getMany();
  
//   //   const count = await this.usersrepository
//   //     .createQueryBuilder('user')
//   //     .where('user.email ILIKE :keyword OR user.name ILIKE :keyword', {
//   //       keyword: `%${keyword}%`,
//   //     })
//   //     .getCount();
  
//   //   if (count === 0) {
//   //     throw new NotFoundException(
//   //       `No search results found for query "${keyword}"`,
//   //     );
//   //   }
  
//   //   return result;
//   // }
  

//   //contract
//   //date, designer, photographer, models, contract type, amount agreed, duration, expirationday, contractststus

//   async contract(contractdto: ContractDto): Promise<Contracts> {
//     const contract = new Contracts();
//     // contract.fashion_mogul = mogul;
//     // contract.fashion_model = model;
//     // contract.photographer = photographer;
//     contract.contract_worth = contractdto.contract_worth;
//     contract.contract_duration = contractdto.contract_duration;
//     contract.commence_date = new Date();
//     contract.expiration_date = this.expirationdateforcontract(
//       contract.commence_date,
//       contract.contract_duration,
//     );
//     return await this.contractrepository.save(contract);
//   }

//   private expirationdateforcontract(
//     startdate: Date,
//     duration: ContractDuration,
//   ): Date {
//     const startDateObj = new Date(startdate);
//     if (!(startDateObj instanceof Date && !isNaN(startDateObj.getTime()))) {
//       throw new HttpException(
//         `invalid start date ${startdate}`,
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     let monthtoadd: number;
//     switch (duration) {
//       case ContractDuration.ONE_MONTH:
//         monthtoadd = 1;
//         break;
//       case ContractDuration.THREE_MONTHS:
//         monthtoadd = 3;
//         break;
//       case ContractDuration.SIX_MONTHS:
//         monthtoadd = 6;
//         break;
//       case ContractDuration.ONE_YEAR:
//         monthtoadd = 12;
//         break;
//       default:
//         throw new HttpException(
//           `invalid duration ${duration}`,
//           HttpStatus.BAD_REQUEST,
//         );
//     }
//     return add(startdate, { months: monthtoadd });
//   }
// }
