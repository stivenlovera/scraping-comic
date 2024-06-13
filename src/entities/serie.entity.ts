import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, ObjectIdColumn, ObjectId } from "typeorm";
import { Obra } from "./obra.entity";
import { Artista } from "./artista.entity";

@Entity({ name: 'serie' })
export class Serie {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;
}