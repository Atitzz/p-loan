import BaseEntity from "../../../entities/baseEntity";
import { Users } from "../../Users/entities"
import { Loan } from "../../Loan/entities/loan"
import { Column, Entity } from "typeorm";

// รายการยา
@Entity("contactus")
export class ContactUS extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    mobile: string;

    @Column({ type: 'varchar', nullable: true })
    subject: string;

    @Column({ type: 'text' })
    message: string;
    @Column({ type: 'enum',enum:[0,1],default:0 })
    is_read: number;
}