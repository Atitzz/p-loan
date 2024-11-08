import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import BaseEntity from "../../../entities/baseEntity";


@Entity("loan_advert")
export class LoanAdvert extends BaseEntity {
    @Column({ type: 'longtext', nullable: true })
    images: string;

    @Column({ type: 'varchar'})
    title: string;

    @Column({ type: 'longtext', nullable: true })
    description: string;
}
