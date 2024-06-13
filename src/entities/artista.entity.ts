
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, JoinColumn, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Artista {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;

    @Column()
    href: string;

    @Column()
    cantidad: number;

    constructor(nombre: string, href: string, cantidad: number) {
        this.nombre = nombre
        this.href = href
        this.cantidad = cantidad
    }
}