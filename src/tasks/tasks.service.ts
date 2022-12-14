import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.model'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common'
//import { ConfigService } from '@nestjs/config';  //*** FOR ENV VARIABLES 

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService', { timestamp: true });

    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        //private configService: ConfigService      //*** FOR ENV VARIABLES 
    ) {
        //console.log( configService.get('STAGE') );   //*** FOR ENV VARIABLES 
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.tasksRepository.createQueryBuilder('task');
        query.where({ user });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}` });
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}. Filters: ${JSON.stringify(filterDto)}"`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        // Take values from request
        const { title, description } = createTaskDto;

        // Create task
        const task: Task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })

        // Save to database
        await this.tasksRepository.save(task);

        // Return task
        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOne({ where: { id, user } });


        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user });

        // Check if find the task
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }
}
