import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Loan } from "./loan"
import BaseEntity from "../../../entities/baseEntity";

@Entity('loan_property')
export class LoanProperty extends BaseEntity {
    @Column({ type: 'int', default: 1 })
    index: number;
    
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;
}