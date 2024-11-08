import {
    Entity,
    Column,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";

@Entity('frontend')
export class Frontend extends BaseEntity {
    @Column({ type: 'varchar', length: 40, nullable: true })
    dataKeys: string;

    @Column({ type: 'longtext', nullable: true })
    dataValues: string;

    @Column({ type: 'longtext', nullable: true })
    seoContent: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    tempname: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;
}
