import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity({ name: 'pagina' })
export class Pagina {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    numero: number;

    @Column()
    url_original: string;

    @Column()
    url_small: string;

    @Column()
    url_medio: string;

    @Column()
    url_big: string;

    @Column()
    url_scraping: string;

    @Column()
    data_scraping: string;
    
}