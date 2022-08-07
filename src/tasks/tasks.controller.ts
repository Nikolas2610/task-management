import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common'
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(
        private taskService: TasksService
    ) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.taskService.getTasks(filterDto, user);
    }

    @Post()
    @Roles(Role.USER)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" has create a task with title: ${JSON.stringify(createTaskDto.title)}`)
        return this.taskService.createTask(createTaskDto, user);
    }


    @Get('/:id')
    async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }


    @Delete('/:id')
    async deleteTaskById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        this.taskService.deleteTaskById(id, user);
    }


    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id') id: string,
        @GetUser() user: User,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
