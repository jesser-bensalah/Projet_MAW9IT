import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCaspanneDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'La marque est obligatoire' })
  marque: string;

  @IsString()
  @IsNotEmpty({ message: 'Le modèle est obligatoire' })
  modele: string;

  @IsString()
  @IsNotEmpty({ message: 'Le matricule est obligatoire' })
  @MinLength(3, { message: 'Le matricule doit avoir au moins 3 caractères' })
  matricule: string;

  @IsString()
  @IsNotEmpty({ message: 'Le type de panne est obligatoire' })
  typepanne: string;
}