import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('support_attachment')
export class SupportAttachment extends BaseEntity {
  @Column({ type: 'int', unsigned: true, default: 0 })
  supportMessageId: number;

  @Column({ type: 'longtext', nullable: true })
  attachment: string;
}