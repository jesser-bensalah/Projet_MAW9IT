// src/map/entities/map.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'map'})
export class Map {
    @PrimaryGeneratedColumn()
    idMap: number;  

    @Column('decimal', { precision: 10, scale: 8 }) // ← CHANGER LE TYPE
    latitude: number; // ← CHANGER EN number

    @Column('decimal', { precision: 11, scale: 8 }) // ← CHANGER LE TYPE
    longitude: number; // ← CHANGER EN number
}