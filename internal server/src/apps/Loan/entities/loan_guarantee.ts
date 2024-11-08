import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { LoanProperty } from "./loan_property"
import BaseEntity from "../../../entities/baseEntity";

@Entity('loan_guarantee')
export class LoanGuarantee extends BaseEntity {
    // @ManyToOne(() => LoanProperty, { eager: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // @JoinColumn({ name: 'property_id'})
    // property: LoanProperty;
    // @Column({ type: 'int', nullable: false})
    // property_id: number;
    @Column({ type: 'int', default: 1 })
    index: number;
    
    @Column({ type: 'varchar', length: 100, nullable: false})
    type: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;
}