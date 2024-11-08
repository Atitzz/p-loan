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


@Entity('users_email_verify')
export class Users_Email extends BaseEntity {
    @Column({ type: 'varchar' ,nullable:true})
    from: string;

    @Column({ type: 'text',nullable:true })
    to: string;
    
    @Column({ type: 'text',nullable:true })
    user_id: string;
    
    @Column({ type: 'varchar',nullable:true})
    token: string;

    @Column({ type: 'enum',enum:[true,false],default:false})
    verify: string;
}