import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'casretard'})
export class Casretard {
    @PrimaryGeneratedColumn()
    idCasRetard: number;

    @Column()
    perioderetard: string;

    @Column()
    causeretard: string;
}
