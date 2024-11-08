import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../../Users/entities";
import BaseEntity from "../../../entities/baseEntity";
import { System_Logs } from "../../Syetem_Logs/entities";
import { orm } from "../../../data-source";
import { IsNotEmpty } from "class-validator";

@Entity("system_roles")
export class Roles extends BaseEntity {
  @Column({ type: "varchar", unique: true })
  @IsNotEmpty()
  key: string;

  @Column({ type: "varchar", unique: true })
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => Users, (x) => x.roles, { cascade: true })
  @JoinTable()
  users: Users[];
}
