import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AppService {
  constructor(
  ) {}

  async welcome():Promise<string>{
    return await  "this is the api service for walkway "
  }
  }