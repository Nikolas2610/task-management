import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class TasksModule { }
