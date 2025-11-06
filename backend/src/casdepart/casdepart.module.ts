import { Module } from '@nestjs/common';
import { CasdepartService } from './casdepart.service';
import { CasdepartController } from './casdepart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casdepart } from './entities/casdepart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Casdepart])],
  controllers: [CasdepartController],
  providers: [CasdepartService],
})
export class CasdepartModule {}
