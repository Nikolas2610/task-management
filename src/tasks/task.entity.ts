import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(_type => User, user => user.tasks, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: User
}