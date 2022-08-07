import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.model";

export class UpdateTaskStatusDto {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;
}