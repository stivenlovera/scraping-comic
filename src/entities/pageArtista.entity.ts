import { Entity, Column, ObjectId, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ObjectIdColumn, OneToMany } from "typeorm";
import { Dato } from "./data.entity";

@Entity({ name: 'pagina' })
export class PageArtista {
    @PrimaryGeneratedColumn('increment')
    pagina_id?: number;

    @Column()
    nombre: string;

    @Column()
    href: string;

    @CreateDateColumn()
    fechaCreacion?: Date;

    @Column()
    cantidad?: number;

    @OneToMany(() => Dato, (dato) => dato.dato)
    datos: Dato[]
}