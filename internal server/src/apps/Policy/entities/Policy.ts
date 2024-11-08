import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../../Users/entities";
import BaseEntity from "../../../entities/baseEntity";
import { System_Logs } from "../../Syetem_Logs/entities";
import { orm } from "../../../data-source";

@Entity("policy")
export class Policy extends BaseEntity {
  @Column({ type: "longtext" })
  message: string;

  @Column({ type: "varchar",default:'1.0'})
  version: string;

}