import {
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { status, is_featured } from "../../Utils/enum"

@Entity('loan_plan')
export class LoanPlan extends BaseEntity {
  @Column({ type: 'longtext', nullable: true })
  images: string;

  @Column({ type: 'int', default: 0 })
  form_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  minimum_amount: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  maximum_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00, comment: '%' })
  per_installment: number;

  // @Column({ type: 'int', default: 0, comment: 'In Day' })
  // installment_interval: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'ค่าปรับ' })
  application_fixed_charge: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'ค่าธรรมเนียม' })
  application_percent_charge: number;

  @Column({ type: 'text', nullable: true })
  instruction: string;

  @Column({ type: 'int', unsigned: true, default: 15 })
  delay_value: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าทวงถาม1' })
  fixed_charge: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าทวงถาม2' })
  fixed_charge2: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  percent_charge: number;

  @Column({ type: 'enum', enum: status, default: status.Enable })
  status: status;

  @Column({ type: 'json', nullable: false })
  rate: Array<{
    installment: number,
    interest_rate: number,
    index: number,
  }>;

  // @Column({ type: 'int', unsigned: true, default: 12 })
  // per_interest: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 2000.00000000 })
  stamp: number;

  @Column({ type: 'int', default: 0})
  document: number;

  @Column({ type: 'enum', enum: ['is_guarantee', 'not_guarantee'], default: 'not_guarantee', comment: 'มีหลักประกันหรือไม่' })
  is_guarantee: string;

  @Column({ type: 'enum', enum: ['flatrate', 'effectiverate'], nullable: true, default: null, comment: 'ประเภทดอกเบี้ย' })
  type_interest: string;
}