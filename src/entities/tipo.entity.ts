import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity({ name: 'tipo' })
export class Tipo {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;
}