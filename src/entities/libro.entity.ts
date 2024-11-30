
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, JoinColumn, ObjectIdColumn, ObjectId, ManyToOne } from "typeorm";
import { Dato } from "./data.entity";

@Entity({ name: 'libro' })
export class Libro {
    @PrimaryGeneratedColumn('increment')
    libro_id?: number;
    
    @Column()
    href: string;

    @Column()
    completed: number;

    @Column()
    dato_id?: number;

    @ManyToOne(() => Dato, (dato) => dato.libros)
    @JoinColumn([{ name: 'dato_id', referencedColumnName: 'dato_id' }])
    dato?: Dato
}