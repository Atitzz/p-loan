import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('qrpayment')
export class QRPayment extends BaseEntity {
    @Column({ type: "varchar",nullable:true })
    loan_number: string;

    @Column({ type: "varchar"})
    referenceNo: string; 

    @Column({ type: "varchar",nullable:true,default:""})
    orderNo: string; 

    @Column({ type: "varchar",nullable:true,default:""})
    merchantid: string; 

    @Column({ type: "varchar",nullable:true,default:""})
    cardtype: string; 
    
    @Column({ type: "varchar", default: "0.00" })
    total: string;

    @Column({ type: "varchar", default: "0.00" })
    received: string;

    @Column({ type: 'varchar',nullable:true, default: "" })
    orderdatetime: Date;

    @Column({ type: 'varchar',nullable:true, default: "" })
    expiredate: Date;

    @Column({ type: "varchar",nullable: true })
    image: string;

    @Column({ type: "varchar",nullable: true })
    barcode: string;

    @Column({ type: 'varchar', default: 'Pending' })
    callback: string;

    @Column({ type: 'enum', enum:['pending','success','error'],default: 'pending' })
    update_installment: string;

    @Column({ type: "text",nullable: true })
    message: string;

    @Column({ type: 'enum', enum: ['โอน', 'เงินสด'], default: 'โอน' })
    type: string;
}