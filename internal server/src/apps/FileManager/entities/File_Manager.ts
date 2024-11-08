import {
    Entity,
    Column,
} from "typeorm";
import { IsIn, IsNotEmpty, IsNumber, Matches } from "class-validator";
import BaseEntity from "../../../entities/baseEntity";


@Entity('file_manager')
export class File_Manager extends BaseEntity {
    @Column({ type: 'int',default:-1})
    ref_id: number;

    @Column({ type: 'varchar',default:-1})
    folder_id: string;

    @Column({ type: 'varchar',nullable:true})
    name: string;

    @Column({ type: 'longtext',nullable:true})
    base64: string;
}