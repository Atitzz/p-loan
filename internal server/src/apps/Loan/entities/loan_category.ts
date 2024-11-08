import {
  Entity,
  Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { status } from "../../Utils/enum"

@Entity('loan_category')
export class LoanCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 40, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: status, default: status.Enable })
  status: status;
}