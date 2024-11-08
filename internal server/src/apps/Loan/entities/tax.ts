import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from "../../../entities/baseEntity";
import { Users } from "../../Users/entities"
import { Loan } from "../../Loan/entities/loan"


@Entity("loan_tax")
export class Tax extends BaseEntity {
    // @Column({ type: "int" })
    // transaction_id: number;

    @Column({ type: "int" })
    installment_id: number;
    
    @Column({ type: "int" })
    loan_id: number;

    @Column({ type: "int" })
    user_id: number;

    @Column({ type: "varchar" })
    loan_number: string

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    principle: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    interest: number;

    @Column({ type: 'int'})
    interest_rate: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    tax_business: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    tax_local: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    total_tax: number;
}
