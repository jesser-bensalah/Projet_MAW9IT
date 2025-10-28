import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'caspanne'})
export class Caspanne {
    @PrimaryGeneratedColumn()
    idCasPanne: number;

    @Column()
    nom: string;

    @Column()
    marque: string;

    @Column()
    modele: string;

    @Column()
    matricule: string;

    @Column()
    typepanne: string;
    
}
