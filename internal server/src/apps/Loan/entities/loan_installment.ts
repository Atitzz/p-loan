import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { clearParserCache } from "mysql2";

@Entity('loan_installment')
export class Installment extends BaseEntity {
    @Column({ type: 'int', unsigned: true })
    plan_id: number;

    @Column({ type: 'int', unsigned: true })
    loan_id: number;

    @Column({ type: 'int', unsigned: true })
    user_id: number;

    @Column({ type: 'varchar', nullable: true })
    qrcode: string;

    @Column({ type: 'varchar', nullable: true })
    barcode: string;

    @Column({ type: 'varchar', nullable:true })
    loan_number:string;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000 })
    delay_charge: number;

    @Column({ type: 'timestamp', nullable: true })
    start_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    installment_date: Date;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 })
    amount: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "ยอดหนี้คงเหลือทั้งหมด" })
    outstanding_balance: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "เงินต้นคงเหลือ" })
    remaining: number;

    @Column({ type: 'enum', enum: ['โอน', 'เงินสด'], default: 'โอน' })
    type: string;

    @Column({ type: 'timestamp', nullable: true })
    given_at: Date;

    @Column({ type: 'int', nullable: true })
    delay_days: number;

    @Column({ type: 'int', default: 1 })
    installment: number;

    @Column({ type: 'int', default: 1 })
    total_installment: number;

    @Column({ type: 'boolean', default: false, comment: 'งวดนี้จ่ายแล้วหรือยัง' })
    isPaid: boolean;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดที่จ่ายในงวดนี้' })
    paid: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดที่ต้องชำระ' })
    per_installment: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'เงินต้นที่ต้องชำระในงวดนี้' })
    principle_installment: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ดอกเบี้ยที่ต้องชำระในงวดนี้' })
    interest_installment: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายค่าปรับเท่าไปเท่าไหร่' })
    delay_charge_paid: number

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายดอกเบี้ยไปเท่าไหร่' })
    interest_paid: number

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายเงินต้นไปเท่าไหร่' })
    principle_paid: number

    @Column({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดค้าง' })
    overdue_balance: number

    @Column({ type: 'boolean', default: false, comment: 'จ่ายเต็มจำนวนยอดต่อเดือนหรือไม่' })
    paidFull: boolean

    @Column({ type: 'varchar', nullable: true })
    paid_by: string

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าธรรมเนียม' })
    application_charge: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินสด' })
    cash: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินโอน' })
    transfer_payment: number;

    @Column({ type: 'longtext', nullable: true })
    image: string;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยแต่ละเดือน' })
    interest_due: number;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยคงเหลือทั้งหมด' })
    total_interest: number;

    @Column({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'เงินต้นที่ต้องจ่ายงวดถัดไป' })
    principle_next_due: number;

    @Column({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยที่ต้องจ่ายงวดถัดไป' })
    interest_next_due: number;

    @Column({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดรวมที่ต้องจ่ายงวดถัดไป' })
    total_amount_next_due: number;

    @Column({ type: 'timestamp', nullable: true, comment: 'วันชำระงวดถัดไป' })
    installment_next_due: Date;

    @Column({ type: 'varchar', nullable: true})
    receipt_number: string;

    @Column({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "เงินต้นคงเหลือ" })
    principle: number;
}