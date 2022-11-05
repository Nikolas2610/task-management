import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles/roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true})
    username: string;

    @Column()
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.USER})
    role: Role;

    @OneToMany(_type => Task, task => task.user, { eager: true })
    tasks: Task[];
}