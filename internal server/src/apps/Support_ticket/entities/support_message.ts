import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('support_message')
export class SupportMessage extends BaseEntity {
  @Column({ type: 'int', unsigned: true, default: 0 })
  supportTicketId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  adminId: number;

  @Column({ type: 'longtext', nullable: true })
  message: string;
}