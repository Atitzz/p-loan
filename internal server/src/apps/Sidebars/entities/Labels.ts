import {
    Entity,
    Column,
    ManyToMany,
    ManyToOne,
  } from "typeorm";
import { Route } from "./Route";
import BaseEntity from "../../../entities/baseEntity";
import { Permissions } from "../../Permission/entities";
import { Menu } from "./Menu";

  @Entity('system_labels')
  export class System_labels extends BaseEntity {
    @Column({ type: "varchar", unique: true })
    name: string;

    @Column({ type: "varchar"})
    lang: string;

    @ManyToOne(() => Menu, (x) => x.labels,{onUpdate:"CASCADE",onDelete:"CASCADE",eager:true})
    menus: string;

    @ManyToOne(() => Route, (x) => x.labels,{onUpdate:"CASCADE",onDelete:"CASCADE",eager:true})
    routes: string;
  }
  