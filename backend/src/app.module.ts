import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FormulairechauffeurModule } from './formulairechauffeur/formulairechauffeur.module';
import { FormulairemécanicienModule } from './formulairemécanicien/formulairemécanicien.module';
import { CaspanneModule } from './caspanne/caspanne.module';
import { CasretardModule } from './casretard/casretard.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'maw9it',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'fallback_secret_key_change_in_production',
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s',
          issuer: 'maw9it-app',
          audience: 'maw9it-users',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FormulairechauffeurModule,
    FormulairemécanicienModule,
    CaspanneModule,
    CasretardModule,
    MessagesModule,
  ],
})
export class AppModule {}