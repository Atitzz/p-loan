import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { status } from "../../Utils/enum"


@Entity('cron_schedules')
export class CronSchedule extends BaseEntity {
    @Column({ type: 'varchar', length: 40, nullable: true })
    name: string;

    @Column({ type: 'int', default: 0 })
    interval: number;

    @Column({ type: 'enum', enum: status, default: status.Enable })
    status: status;
}