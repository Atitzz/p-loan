import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany,
    Index
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import BaseEntity from "../../../entities/baseEntity";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";


@Entity('users_sms_verify')
export class Users_SMS extends BaseEntity {
    @Column({ type: 'varchar',unique:true })
    mobile: string;
    
    @Column({ type: 'varchar'})
    ref_code: string;

    @Column({ type: 'text'})
    token:string
}