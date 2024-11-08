import {
  Entity,
  Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity({ name: 'loan_transaction' })
export class Transaction extends BaseEntity {
  @Column({ type: 'int', unsigned: true, default: 0 })
  user_id: number;

  @Column({ type: 'int', default: 0 })
  loan_id: number;

  @Column({ type: 'varchar', length: 100 })
  plan: string;

  @Column({ type: 'varchar', length: 20 })
  loan_number: string;

  @Column({ type: 'int', default: 0 })
  installment_id: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  installment_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  given_at: Date;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  paid: number;

  @Column({ type: 'int', default: 0 })
  given_installment: number;

  @Column({ type: 'int', default: 0 })
  total_installment: number;

  @Column({ type: 'int', default: 0 })
  delay_days: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  delay_charge: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าปรับ' })
  application_fixed_charge: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าธรรมเนียม' })
  application_percent_charge: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  receivable: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  total_paid: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  remaining: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ตัดเงินต้นเท่าไหร่' })
  principle: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ตัดดอกเบี้ยเท่าไหร่' })
  interest: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค้างชำระ' })
  overdue_balance: number;

  @Column({ type: 'int', nullable: true })
  days: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินสด' })
  cash: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินโอน' })
  transfer_payment: number
}