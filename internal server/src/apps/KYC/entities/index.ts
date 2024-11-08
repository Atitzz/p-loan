import { Entity, Column } from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { IsNotEmpty, IsNumber, Length, Matches, Min } from "class-validator";

@Entity("users_kyc")
export class Users_KYC extends BaseEntity {
  @Column({ type: "int" })
  user_id: string;

  @Column({ type: "varchar" ,nullable: true})
  @IsNotEmpty()
  titlename: string;

  @Column({ type: "varchar",nullable: true })
  @IsNotEmpty()
  firstname: string;

  @Column({ type: "varchar",nullable: true })
  @IsNotEmpty()
  lastname: string;

  @Column({ type: 'varchar',length:50,nullable: true})
  @IsNotEmpty()
  birthdate: string;

  @Column({ type: 'varchar',length:50,nullable: true})
  @IsNotEmpty()
  citizen_id: string;

  @Column({ type: "varchar", nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 50,nullable: true })
  @IsNotEmpty()
  back_id: string;

  @Column({ type: "varchar",nullable: true })
  @IsNotEmpty()
  job: string;

  @Column({ type: "decimal", precision: 28, scale: 8, default: 0 })
  @IsNotEmpty()
  salary: number;

  @Column({ type: "longtext",nullable: true })
  @IsNotEmpty()
  imgFront: string;

  @Column({ type: "longtext",nullable: true })
  @IsNotEmpty()
  imgBack: string;

  @Column({ type: "longtext",nullable: true })
  @IsNotEmpty()
  imgBook: string;

  @Column({ type: 'varchar',nullable:true })
  @IsNotEmpty()
  book: string;

  @Column({ type: 'varchar',nullable:true })
  @IsNotEmpty()
  bank: string;

  @Column({
    type: "enum",
    enum: ["pending", "reject", "approve"],
    default: "pending",
  })
  status: string;

  @Column({ type: "text",nullable:true })
  reject_reason: string;

  @IsNotEmpty()
  @Column({ type: 'text',nullable:true})
  address: string;

  @Column({ type: 'varchar',nullable:true })
  houseno: string;

  @Column({ type: 'varchar',nullable:true })
  villageno: string;

  @Column({ type: 'varchar',nullable:true })
  lane: string;

  @Column({ type: 'varchar',nullable:true })
  road: string;

  @Column({ type: 'varchar',nullable:true })
  subdistrict: string;

  @Column({ type: 'varchar',nullable:true })
  district: string;

  @Column({ type: 'varchar',nullable:true })
  province: string;

  @Column({ type: 'varchar',nullable:true })
  zipcode: string;

  @IsNotEmpty()
  @Column({ type: 'varchar',nullable:true })
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

  @Column({ type: "varchar",nullable:true, default:'ไทย' })
  job_country: string;

  @Column({ type: "varchar", nullable: true })
  email: string;
}
