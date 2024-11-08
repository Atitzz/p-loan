import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { type_option } from "../../Utils/enum"


@Entity('loan_applicationform')
export class Application_Form extends BaseEntity {
    @Column({ type: 'int', default: 0 })
    plan_id: number;

    @Column({ type: 'int', default: 0 })
    index: number;

    @Column({ type: 'varchar', length: 20 })
    type: string;

    @Column({ type: 'varchar', length: 20 })
    field_name: string;

    @Column({ type: 'enum', enum: type_option,default:type_option.required })
    is_required: type_option;

    @Column({ type: 'varchar', length: 100 })
    label: string;

    @Column({ type: 'json', nullable: true })
    options: string[];

    @Column({ type: 'int', default: 0 })
    width: number;

    @Column({ type: 'varchar', nullable: true })
    instruction: string;

    @Column({ type: 'json', nullable: true })
    extensions: string[];
}