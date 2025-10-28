import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'formulairesmécaniciens' })
export class Formulairemécanicien {
    @PrimaryGeneratedColumn()
    idMecanicien: number;

    @Column()
    nomgarageouentreprise: string;

    @Column()
    adresse: string;

    @Column()
    numtel: string;

    @Column()
    numbon: number;
}
