import {
    Entity,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
  } from "typeorm";
import { Menu } from "./Menu";
import BaseEntity from "../../../entities/baseEntity";
import { System_labels } from "./Labels";
  @Entity('system_routes')
  export class Route extends BaseEntity {
    @Column({ type: "int",default:-1 })
    index: number;
  
    @Column({ type: "varchar"})
    name: string;

    @Column({ type: "varchar"})
    name_th: string;

    @OneToMany(() => System_labels, (x) => x.routes, { cascade: true })
    labels: System_labels[];

    @Column({ type: "varchar",default:"" })
    icon: string;

    @Column({ type: "text"})
    component: string;

    @Column({ type: "enum",enum:["sidebar","route"],default:"sidebar"})
    type: string;

    @Column({ type: "varchar", default:"" })
    path: string;

    @Column({ type: "varchar", default:"" })
    link: string;

    @Column({ type: "text"})
    details: string;
  
    @Column({ type: "enum",enum:[true,false], default:false })
    badge: boolean;

    @Column({ type: "varchar",default:"" })
    badge_param: string;

    @ManyToMany(() => Menu, (x) => x.route,{cascade:true})
    @JoinTable()
    menu: Menu[];
  }
  