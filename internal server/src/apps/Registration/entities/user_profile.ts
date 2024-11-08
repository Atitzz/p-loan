import {
  Entity,
  Column,
  BeforeInsert,
} from "typeorm";
import BaseEntity from "../../../entities/baseEntity";
import { Allow } from "../../Utils/enum";
import { AppDataSource, orm } from "../../../data-source";

@Entity("user_profile")
export class User_profile extends BaseEntity {
  @Column({ type: "text", nullable: true })
  fullname: string;

  @Column({ type: "varchar", default: "" })
  title: string;

  @Column({ type: "varchar", default: "" })
  firstname: string;

  @Column({ type: "varchar", default: "" })
  lastname: string;

  @Column({ type: "varchar", default: "ไทย" })
  group: string;

  @Column({ type: "varchar", default: "" })
  citizenid: string;

  @Column({ type: "date", nullable: true })
  birthdate: Date;

  @Column({ type: "varchar", length: 50, default: "" })
  tel: string;

  @Column({ type: "varchar", default: "สัญชาติ" })
  nationality: string;

  @Column({ type: "varchar", default: "เชื้อชาติ" })
  ethnicity: string;

  @Column({ type: "varchar", default: "ศาสนา" })
  religion: string;

  @Column({ type: "varchar", default: "ไม่ระบุ" })
  address: string;

  @Column({ type: "varchar", default: "" })
  houseno: string;

  @Column({ type: "varchar", default: "" })
  lane: string;

  @Column({ type: "varchar", default: "" })
  province: string;

  @Column({ type: "varchar", default: "" })
  road: string;

  @Column({ type: "varchar", default: "" })
  district: string;

  @Column({ type: "varchar", default: "" })
  subdistrict: string;

  @Column({ type: "varchar", default: "" })
  villageNo: string;

  @Column({ type: "varchar", default: "" })
  zipcode: string;

  @Column({ type: "varchar", default: "" })
  country: string;

  @Column({ type: "varchar", default: "" })
  nhouseno: string;

  @Column({ type: "varchar", default: "" })
  nvillageNo: string;

  @Column({ type: "varchar", default: "" })
  nlane: string;

  @Column({ type: "varchar", default: "" })
  nprovince: string;

  @Column({ type: "varchar", default: "" })
  nroad: string;

  @Column({ type: "varchar", default: "" })
  nsubdistrict: string;

  @Column({ type: "varchar", default: "" })
  ndistrict: string;

  @Column({ type: "varchar", default: "" })
  nzipcode: string;

  @Column({ type: "varchar", default: "" })
  ncountry: string;

  @Column({ type: "varchar", default: "ไม่ระบุ" })
  sex: string;

  @Column({ type: "varchar", default: "ไม่ระบุ" })
  blood_type: string;

  @Column({ type: "varchar", default: "ไม่ระบุ" })
  relation: string;

  @Column({ type: "int", default: 0 })
  child: number;

  @Column({ type: "text", nullable: true })
  etc: string;

  @Column({ type: "varchar", default: "" })
  email: string;

  @Column({ type: "varchar", default: "" })
  phone: string;

  @Column({ type: "varchar", default: "" })
  job: string;

  @Column({ type: "varchar", default: "" })
  jobphone: string;

  @Column({ type: "text", nullable: true })
  jobaddress: string;

  @Column({ type: "varchar", default: "" })
  timecontact: string;

  @Column({ type: "varchar", default: "" })
  oncontact: string;

  @Column({ type: "varchar", default: "" })
  er_contract: string;

  @Column({ type: "varchar", default: "" })
  er_tel: string;

  @Column({ type: "varchar", default: "" })
  er_relation: string;

  @Column({ type: 'date' })
  registered_at: Date;
}
