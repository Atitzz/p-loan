import BaseEntity from "../../../entities/baseEntity";
import { Users } from "../../Users/entities"
import { Loan } from "../../Loan/entities/loan"
import { Column, Entity } from "typeorm";

// รายการยา
@Entity("loan_contract_non_user")
export class LoanContractNonUser extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    amount: string;

    @Column({ type: 'varchar', nullable: true })
    firstname: string;

    @Column({ type: 'varchar', nullable: true })
    birthdate: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    mobile: string;

    @Column({ type: 'varchar', nullable: true })
    job: string;

    @Column({ type: 'varchar', nullable: true })
    objective: string;
    
    @Column({ type: 'varchar', nullable: true })
    income: string;

    @Column({ type: 'varchar', nullable: true })
    lastname: string;

    @Column({ type: 'varchar', nullable: true })
    sex: string;

    @Column({ type: 'varchar', nullable: true })
    country: string;

    @Column({ type: 'varchar', nullable: true })
    email2: string;

    @Column({ type: 'varchar', nullable: true })
    job_company_name: string;

    @Column({ type: 'varchar', nullable: true })
    job_address: string;

    @Column({ type: 'varchar', nullable: true })
    loan_plan: string;

    @Column({ type: 'enum',enum:[0,1],default:0 })
    is_read: number;
}