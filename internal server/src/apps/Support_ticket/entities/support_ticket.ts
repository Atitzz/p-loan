import {
    Entity,
    Column,
    BeforeInsert
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { ticket_status, priority_ticket } from "../../Utils/enum"


@Entity('support_ticket')
export class SupportTicket extends BaseEntity {
  @Column({ type: 'int', default: 0 })
  userId: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  ticket: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'enum', enum: ticket_status , default: ticket_status.Open })
  status: ticket_status;

  @Column({ type: 'enum', enum: priority_ticket })
  priority: priority_ticket;

  @Column({ type: 'datetime', nullable: true })
  lastReply: Date;
}