import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from "../../../entities/baseEntity";
import { Users } from "../../Users/entities"
import { Loan } from "../../Loan/entities/loan"

// รายการยา
@Entity("loan_contract")
export class LoanContract extends BaseEntity {
    @Column({ name: "user_id", type: "int" })
    user_id: number;

    @Column({ name: "loan_id", type: "int" })
    loan_id: number;

    @Column({ type: 'timestamp', nullable: true })
    installment_start: Date;

    @Column({ type: 'timestamp', nullable: true })
    installment_end: Date;

    @Column({ type: 'int', comment: 'อากรสแตมป์' })
    stamp: number;

    @Column({ type: 'int', comment: 'เอกสาร คู่ฉบับ/คู่ฉีก' })
    document: number;
}
