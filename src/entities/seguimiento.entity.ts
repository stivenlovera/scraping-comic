import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'seguimiento' })
export class Seguimiento {
    @PrimaryGeneratedColumn('increment')
    seguimiento_id?: number;

    @CreateDateColumn()
    fecha: Date;

    @Column()
    artista: string;

    @Column()
    completed: boolean;

    @Column()
    numero_obra: number;

}