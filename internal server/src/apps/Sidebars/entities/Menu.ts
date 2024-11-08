import {
    Entity,
    Column,
    ManyToMany,
    OneToMany,
  } from "typeorm";
import { Route } from "./Route";
import BaseEntity from "../../../entities/baseEntity";
import { Permissions } from "../../Permission/entities";
import { System_labels } from "./Labels";

  @Entity('system_menus')
  export class Menu extends BaseEntity {

    @Column({ type: "int",default:-1 })
    index: number;
  
    @Column({ type: "varchar"})
    name: string;

    @Column({ type: "varchar"})
    name_th: string;

    @OneToMany(() => System_labels, (x) => x.menus, { cascade: true })
    labels: System_labels[];

    @Column({ type: "varchar",default:"" })
    icon: string;

    @Column({ type: "text"})
    details: string;

    @Column({ type: "enum",enum:[true,false], default:false })
    badge: boolean;

    @Column({ type: "varchar",default:"" })
    badge_param: string;
    
    @ManyToMany(() => Route, (x) => x.menu,{onUpdate: "CASCADE",   onDelete:"CASCADE",eager:true})
    route: Route[];

    @ManyToMany(() => Permissions, (x) => x.menus,{onUpdate: "CASCADE",   onDelete:"CASCADE",eager:true})
    permissions: Permissions[];
  }
  