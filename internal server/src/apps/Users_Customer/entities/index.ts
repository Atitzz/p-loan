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


@Entity('users_transactions')
export class Users_Transactions extends BaseEntity {
    @Column({ type: "int" })
    user_id: string;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    balance: string;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    deposits: string;
    
    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    withdrawals: string;
    
}