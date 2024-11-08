import { Entity, Column, ManyToOne, ManyToMany, Index } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import BaseEntity from "../../../entities/baseEntity";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";

@Entity("system_users")
export class Users extends BaseEntity {
  @Index()
  @Column({ type: "varchar", nullable: true })
  line_id: string;

  @Column({ type: "text", nullable: true })
  display_name: string;

  @Column({ type: "text", nullable: true })
  picture_url: string;

  @Column({ type: "varchar", nullable: true })
  titlename: string;

  @Column({ type: "varchar", nullable: true })
  firstname: string;

  @Column({ type: "varchar", nullable: true })
  lastname: string;

  @Column({ type: 'varchar', length: 50,nullable: true })
  citizen_id: string;

  @Column({ type: 'varchar', length: 50,nullable: true })
  back_id: string;

  @Column({ type: 'varchar',length:50,nullable: true})
  birthdate: string;

  @Column({ type: "varchar",nullable: true })
  job: string;

  @Column({ type: "decimal", precision: 28, scale: 8, default: 0 })
  salary: number;

  @Column({ type: 'varchar',nullable:true })
  book: string;

  @Column({ type: 'varchar',nullable:true })
  bank: string;

  @Index()
  @Column({ type: "varchar", nullable: true })
  mobile: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: 'varchar',nullable:true })
  houseno: string;

  @Column({ type: 'varchar',nullable:true })
  villageno: string;

  @Column({ type: 'varchar',nullable:true })
  lane: string;

  @Column({ type: 'varchar',nullable:true })
  road: string;

  @Column({ type: "varchar", nullable: true })
  subdistrict: string;

  @Column({ type: "varchar", nullable: true })
  district: string;

  @Column({ type: "varchar", nullable: true })
  province: string;

  @Column({ type: "varchar", nullable: true })
  zipcode: string;

  @Column({ type: "varchar", nullable: true })
  country: string;

  @Column({ type: 'varchar',nullable:true })
  job_company_name: string;

  @Column({ type: 'varchar',nullable:true })
  job_houseno: string;

  @Column({ type: 'varchar',nullable:true })
  job_villageno: string;

  @Column({ type: 'varchar',nullable:true })
  job_lane: string;

  @Column({ type: 'varchar',nullable:true })
  job_road: string;

  @Column({ type: "varchar", nullable: true })
  job_subdistrict: string;

  @Column({ type: "varchar", nullable: true })
  job_district: string;

  @Column({ type: "varchar", nullable: true })
  job_province: string;

  @Column({ type: "varchar", nullable: true })
  job_zipcode: string;

  @Column({ type: "varchar", nullable: true })
  job_country: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  @Length(4, 30)
  username: string;

  @Column({ type: "text", nullable: true })
  @IsNotEmpty()
  @Length(4, 30)
  password: string;

  @ManyToOne(() => Permissions, (x) => x.users, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    eager: true,
    nullable:true
  })
  permissions: Permissions | null;

  @ManyToMany(() => Roles, (x) => x.users, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    eager: true,
  })
  roles: Roles[];

  @Column({
    type: "enum",
    enum: ["unverified", "pending", "verified"],
    default: "unverified",
    comment: "kyc verify",
  })
  kyc: string;

  @Column({
    type: "enum",
    enum: ["unverified", "verified"],
    default: "unverified",
    comment: "email verify",
  })
  ev: string;

  @Column({
    type: "enum",
    enum: ["unverified", "verified"],
    default: "unverified",
    comment: "mobile verify",
  })
  sv: string;

  @Column({
    type: "enum",
    enum: ["true", "false", "enable", "disable"],
    comment: "2fa",
    default: "disable",
  })
  tf: string;

  @Column({
    type: "enum",
    enum: ["true", "false", "enable", "disable"],
    comment: "pin active",
    default: "disable",
  })
  pa: string;

  @Column({
    type: "enum",
    enum: ["true", "false", "enable", "disable"],
    comment: "line active",
    default: "disable",
  })
  la: string;

  @Column({ type: "varchar", length: 6, nullable: true })
  pin: string;

  @Column({
    type: "enum",
    enum: ["active", "banned"],
    comment: "ban",
    default: "active",
  })
  status: string;

  @Column({
    type: "varchar",
    default: "0.0",
  })
  accept_privacy: string;

  @Column({ type: "text", nullable: true })
  ban_reason: string;
}
