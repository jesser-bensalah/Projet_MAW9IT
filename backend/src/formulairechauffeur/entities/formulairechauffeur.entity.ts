import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'formulaireschauffeurs' })
export class Formulairechauffeur {

    @PrimaryGeneratedColumn()
    idchauffeur: number;

    @Column()
    matricule: string;

    @Column()
    ligneassignée: string;

    @Column()
    numbus: number;

     @Column({ type: 'date' })
  daterrisservice: Date;

  @Column({ type: 'date' })
  daterfinservice: Date;




}
