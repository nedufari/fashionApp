import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormModules } from './typeorm/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { FashionDesignersModule } from './fashion-designers/fashion-designers.module';
import { FashionModelsModule } from './fashion-models/fashion-models.module';
import { PhotographersModule } from './photographers/photographers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './typeorm/typeorm.service';

@Module({
  imports: [
    TypeormModules,
    AuthModule,
    FashionDesignersModule,
    FashionModelsModule,
    PhotographersModule,
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({useClass:TypeOrmService})

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
