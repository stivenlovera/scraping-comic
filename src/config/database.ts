import "reflect-metadata"
import { DataSource } from "typeorm";
import { Artista } from "../entities/artista.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { Serie } from "../entities/serie.entity";
import { Etiqueta } from "../entities/etiqueta.entity";
import { Grupo } from "../entities/grupo.entity";
import { Lenguaje } from "../entities/lenguaje.entity";
import { Obra } from "../entities/obra.entity";
import { Pagina } from "../entities/pagina.entity";
import { Personaje } from "../entities/personaje.entity";
import { Tipo } from "../entities/tipo.entity";
import 'dotenv/config'
import { Seguimiento } from "../entities/seguimiento.entity";
import { Dato } from "../entities/data.entity";
import { Libro } from "../entities/libro.entity";



export const AppDataSource = new DataSource({
    type: "mongodb",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!),
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASS,
    synchronize: false,
    username: process.env.DATABASE_USERNAME,
    authSource: process.env.DATABASE_AUTH,
    //url:`mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${parseInt(process.env.DATABASE_PORT!)}/${process.env.DATABASE}?authSource=${process.env.DATABASE_AUTH}`,
    //logging: false,
    entities: [
        Artista,
        Etiqueta,
        Grupo,
        Lenguaje,
        Obra,
        Pagina,
        Personaje,
        Tipo,
        Serie,
        Seguimiento
    ],
});

export const AppDataSourceMysql = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_MYSQL_HOST,
    port: parseInt(process.env.DATABASE_MYSQL_PORT!),
    database: process.env.DATABASE_MYSQL,
    synchronize: false,
    password: process.env.DATABASE_MYSQL_PASS,
    username: process.env.DATABASE_MYSQL_USERNAME,
    //logging: false,
    entities: [
        Dato,
        PageArtista,
        Libro
    ],
    charset: 'utf8mb4_unicode_ci'
});
