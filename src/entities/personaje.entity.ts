import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity({ name: 'personaje' })
export class Personaje {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;
}