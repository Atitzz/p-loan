import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../../Users/entities";
import BaseEntity from "../../../entities/baseEntity";
import { System_Logs } from "../../Syetem_Logs/entities";
import { orm } from "../../../data-source";

@Entity("users_access_token")
export class UsersAccessToken extends BaseEntity {
  @Column({ type: "int" })
  userid: string;

  @Column({ type: "text", nullable:true })
  token: string;

  @Column({ type: "date",nullable:true  })
  last_used_at: string;

  @Column({ type: "timestamp"  })
  expires_at: number;
}
