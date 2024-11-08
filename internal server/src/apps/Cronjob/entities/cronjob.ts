import {
    Entity,
    Column,
    BeforeInsert
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { cron_status } from "../../Utils/enum"


@Entity('cron_jobs')
export class CronJob extends BaseEntity {
    @Column({ type: 'varchar', length: 40, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    alias: string;

    @Column({ type: 'text', nullable: true })
    action: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string;

    @Column({ type: 'int', default: 0 })
    cron_schedule_id: number;

    @Column({ type: 'datetime', nullable: true })
    next_run: Date;

    @Column({ type: 'datetime', nullable: true })
    last_run: Date;

    @Column({ type: 'enum', enum: cron_status, default: cron_status.Running })
    is_running: cron_status;

    @Column({ type: 'tinyint', default: 1 })
    is_default: boolean;
}