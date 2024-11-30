
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable, JoinColumn, ObjectIdColumn, ObjectId, ManyToOne } from "typeorm";
import { PageArtista } from "./pageArtista.entity";
import { Libro } from "./libro.entity";

@Entity({ name: 'dato' })
export class Dato {
    @PrimaryGeneratedColumn('increment')
    dato_id?: number;

    @Column()
    nombre: string;
    
    @Column()
    completed?: number;

    @Column()
    href: string;

    @Column()
    cantidad: number;

    @Column()
    pagina_id?: number;

    @Column()
    cantidad_obras?: number;

    @ManyToOne(() => PageArtista, (pageArtista) => pageArtista.datos)
    @JoinColumn([{ name: 'pagina_id', referencedColumnName: 'pagina_id' }])
    dato?: PageArtista

    @OneToMany(() => Libro, (libro) => libro.dato)
    libros?: Libro[]
}