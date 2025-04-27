import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity({ name: 'etiqueta' })
export class Etiqueta {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;

    @Column()
    sexo?: string;
}