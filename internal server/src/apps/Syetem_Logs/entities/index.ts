import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from "typeorm";
  @Entity('system_logs')
  export class System_Logs {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @Column({ type: "varchar"})
    table: string;

    @Column({ type: "varchar" })
    action: string;

    @Column({ type: "varchar" })
    method: string;

    @Column({ type: "varchar" })
    path: string;

    @Column({ type: "varchar" })
    username: string;   

    @Column({ type: "longtext" })
    changes: string;   
  }
  