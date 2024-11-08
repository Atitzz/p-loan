import {
    Entity,
    Column,
} from "typeorm";
import { IsIn, IsNotEmpty, IsNumber, Matches } from "class-validator";
import BaseEntity from "../../../entities/baseEntity";


@Entity('folder_manager')
export class Folder_Manager extends BaseEntity {
    @Column({ type: 'varchar'})
    name: string;
}