import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'casdepart'})
export class Casdepart {
    @PrimaryGeneratedColumn()
    idCasDepart: number;        

    @Column()
    tempsdep: string;
    
    @Column()
    tempsarr: string;

    @Column()
    stationdep: string;

    @Column()
    stationarr: string;

    @Column()
    dureeatt: string;
}
