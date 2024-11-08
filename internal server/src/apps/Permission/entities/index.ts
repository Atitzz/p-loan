import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../../Users/entities";
import BaseEntity from "../../../entities/baseEntity";
import { System_Logs } from "../../Syetem_Logs/entities";
import { orm } from "../../../data-source";

@Entity("system_permissions")
export class Permissions extends BaseEntity {
  @Column({ type: "varchar", unique: true })
  key: string;

  @Column({ type: "varchar", unique: true })
  name: string;

  @OneToMany(() => Users, (x) => x.permissions, { cascade: true })
  users: Users[];

  @ManyToMany(() => Menu, (x) => x.permissions, { cascade: true })
  @JoinTable()
  menus: Menu[];

  @Column({ type: "enum", enum: [true, false], default: false })
  approve: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  reject: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  show: boolean;

  @Column({ type: "enum", enum: [true, false], default: true })
  list: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  store: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  update: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  remove: boolean;

  @Column({ type: "enum", enum: [true, false], default: false })
  manage_users: boolean;
}
