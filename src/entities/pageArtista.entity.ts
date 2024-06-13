import { Entity, Column, ObjectId, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ObjectIdColumn } from "typeorm";
import { Artista } from "./artista.entity";

@Entity()
export class PageArtista {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;

    @Column()
    href: string;

    @CreateDateColumn()
    fechaCreacion?: Date;

    @Column((type) => Artista)
    artistas: Artista[]
}