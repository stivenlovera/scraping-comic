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

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!),
    database: process.env.DATABASE,
    synchronize: false,
    //logging: false,
    entities: [
        Artista,
        PageArtista,
        Etiqueta,
        Grupo,
        Lenguaje,
        Obra,
        Pagina,
        Personaje,
        Tipo,
        Serie
    ],
});

/* type: 'mongodb',
host: process.env.DATABASE_HOST,
port: parseInt(process.env.DATABASE_PORT!),
username: process.env.DATABASE_USERNAME,
password: process.env.DATABASE_PASS,
database: process.env.DATABASE,
synchronize: false,
logging: false,
entities: [Artista, PageArtista, ArtistaObra, Etiqueta, EtiquetaObra, Grupo, Lenguaje, Obra, Pagina, Personaje, PersonajeObra, Tipo], */

