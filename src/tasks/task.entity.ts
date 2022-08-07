import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.model";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid') // no numbers increment for id with uuid
    id: string;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status: TaskStatus;
}