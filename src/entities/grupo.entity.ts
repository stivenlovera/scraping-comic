import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity({ name: 'grupo' })
export class Grupo {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;
}