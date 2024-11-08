import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('cron_job_logs')
export class CronJobLog extends BaseEntity {
    @Column({ type: 'int', unsigned: true, default: 0 })
    cron_job_id: number;

    @Column({ type: 'datetime', nullable: true })
    start_at: Date;

    @Column({ type: 'datetime', nullable: true })
    end_at: Date;

    @Column({ type: 'int', default: 0 })
    duration: number;

    @Column({ type: 'text', nullable: true })
    error: string;
}