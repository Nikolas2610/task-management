import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { configValidationSchema } from './common/helper/config.schema';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath, isGlobal: true,
      validationSchema: configValidationSchema
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServise: ConfigService) => {
        return {
          type: 'postgres',
          port: configServise.get('DB_PORT'),
          host: configServise.get('DB_HOST'),
          username: configServise.get('DB_USERNAME'),
          password: configServise.get('DB_PASSWORD'),
          database: configServise.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        }
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }