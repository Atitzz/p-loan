import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('coupon')
export class Coupon extends BaseEntity {
    @Column({ type: "varchar", unique: true })
    code: string;

    @Column({ type: "varchar", default: "" })
    coupon_type: string; 

    @Column({ type: "varchar", default: "" })
    description: string;

    @Column({ type: "float", default: 0 })
    discount_amount: number;

    @Column({ type: 'date' })
    expiry_date: Date;

    @Column({ default: false })
    used: boolean;

    @Column({ type: 'timestamp', nullable: true })
    claimed_at: Date;

    @Column({ type: 'int', default: 0 })
    total_coupons: number;

    @Column({ type: "int", nullable: true })
    user_id: number;
}