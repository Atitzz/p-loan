import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import BaseEntity from "../../../entities/baseEntity";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";


@Entity('users_reset_password')
export class Users_ResetPassword extends BaseEntity {    
    @Column({ type: 'text',nullable:true })
    user_id: string;
    
    @Column({ type: 'varchar',nullable:true})
    token: string;

    @Column({ type: 'enum',enum:[true,false],default:false})
    verify: string;
}