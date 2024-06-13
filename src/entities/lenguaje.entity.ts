import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity({ name: 'lenguaje' })
export class Lenguaje {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;
}