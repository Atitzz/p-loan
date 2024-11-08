import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { orm } from "../data-source";
import { System_Logs } from "../apps/Syetem_Logs/entities";

export default abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    async createLog(req,action: string, table:string,body: object) {
        const log = new System_Logs();
        log.table = table;
        log.action = action;
        log.method = req.method;
        log.path = req.path
        log.username = req.user ? req.user.username != null ? req.user.username : req.user?.mobile != null ? req.user.mobile : 'user' : 'unknown';
        log.changes = JSON.stringify(body);
        await orm(System_Logs).save(log);
    }
}