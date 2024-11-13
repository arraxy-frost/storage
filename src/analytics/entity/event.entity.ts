import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("analytic_events")
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    eventId: string;

    @Column()
    sender: string

    @Column()
    payload: string

    @CreateDateColumn()
    createdAt: Date
}