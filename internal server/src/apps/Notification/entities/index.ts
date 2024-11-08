import {
    Entity,
    Column,
  } from "typeorm";
  import BaseEntity from "../../../entities/baseEntity";


@Entity('notification_email')
export class NotificationEmail extends BaseEntity {
    @Column({ type: 'int', unsigned: true, default: 0 })
    user_id: number;

    @Column({ type: 'varchar', length: 40, nullable: true })
    sent_from: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    sent_to: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    subject: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    notification_type: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    @Column({ type: 'tinyint', width: 4, default: 0 })
    user_read: number;
}