import {
  Entity,
  Column,
  BeforeInsert
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { orm } from "../../../data-source"
import { loan_status } from "../../Utils/enum"

@Entity('loan')
export class Loan extends BaseEntity {
  @Column({ type: 'varchar', length: 40, nullable: true })
  loan_number: string;

  @Column({ type: 'varchar', length: 20 })
  reference: string;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true })
  plan_id: number;

  @Column({ type: 'date', nullable: true, comment: 'เลือกวันเริ่มชำระ' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, comment: 'วันสิ้นสุดการชำระ' })
  endDate: Date;

  @Column({ type: 'date', nullable: true, comment: 'วันเริ่มนับกำหนดชำระ' })
  installment_start: Date;

  @Column({ type: 'date', nullable: true, comment: 'กำหนดชำระ' })
  installment_due: Date;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  amount: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  per_installment: number;

  @Column({ type: 'int', nullable: true, comment: 'Date' })
  day_tricker: number;

  @Column({ type: 'int', default: 15 })
  delay_value: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  charge_per_installment: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
  delay_charge: number;

  @Column({ type: 'int', default: 0 })
  given_installment: number;

  @Column({ type: 'int', default: 0 })
  total_installment: number;

  @Column({ type: 'longtext', nullable: true })
  application_form: string;

  @Column({ type: 'text', nullable: true })
  admin_feedback: string;

  @Column({ type: 'enum', enum: loan_status, default: loan_status.Pending })
  status: loan_status;

  @Column({ type: 'timestamp', nullable: true })
  due_notification_sent: Date;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column({ type: 'varchar', nullable: true })
  admin_approve: String;

  // เพิ่ม
  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ที่ต้องจ่ายทั้งหมด' })
  receivable: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ที่จ่ายมาแล้วทั้งหมด' })
  total_paid: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดคงเหลือ' })
  remaining: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินต้น' })
  principle: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ย' })
  interest: number;

  @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดค้าง' })
  overdue_balance: number;

  @Column({ type: 'int', nullable: true })
  days: number;

  @Column({ type: 'timestamp', nullable: true })
  closed_at: Date;

  @Column({ type: 'date', nullable: true, comment: 'แจ้งเตือนล่าสุด' })
  last_alert_date: Date;

  @Column({ type: 'varchar', nullable: true })
  reject_reason: string;

  @Column({ type: 'int', nullable: true, default: 1 })
  loan_ducument: number;

  @Column({ type: 'int', nullable: true, default: 1 })
  loan_ducument_max: number;

  @Column({ type: 'varchar', nullable: true})
  guarantee: string;

  @Column({ type: 'int', nullable: true, default: null, comment: "ดอกเบี้ยของแต่ละสินเชื่อ" })
  loan_interest: number;
}