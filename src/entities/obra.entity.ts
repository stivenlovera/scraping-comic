import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ObjectId, ObjectIdColumn } from "typeorm";
import { Serie } from "./serie.entity";
import { Pagina } from "./pagina.entity";
import { Personaje } from "./personaje.entity";
import { Lenguaje } from "./lenguaje.entity";
import { Grupo } from "./grupo.entity";
import { Tipo } from "./tipo.entity";
import { Etiqueta } from "./etiqueta.entity";
import { Artista } from "./artista.entity";

@Entity({ name: 'obra' })
export class Obra {
    @ObjectIdColumn()
    id?: ObjectId;

    @Column()
    nombre: string;

    @Column()
    numero_pagina: number;

    @Column()
    fecha_scraping: string;

    @Column()
    fecha: Date;

    @Column((type) => Tipo)
    tipo: Tipo;

    @Column((type) => Grupo)
    grupo: Grupo;

    @Column((type) => Lenguaje)
    lenguaje: Lenguaje;

    @Column()
    url_scraping: string;

    @Column((type) => Artista)
    artistas: Artista[];

    @Column((type) => Personaje)
    personajes: Personaje[];

    @Column((type) => Serie)
    series: Serie[];

    @Column((type) => Pagina)
    paginas: Pagina[];

    @Column((type) => Etiqueta)
    etiquetas: Etiqueta[];

    @Column()
    codigo: string;
}