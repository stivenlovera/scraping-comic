"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const artista_entity_1 = require("../entities/artista.entity");
const pageArtista_entity_1 = require("../entities/pageArtista.entity");
const serie_entity_1 = require("../entities/serie.entity");
const etiqueta_entity_1 = require("../entities/etiqueta.entity");
const grupo_entity_1 = require("../entities/grupo.entity");
const lenguaje_entity_1 = require("../entities/lenguaje.entity");
const obra_entity_1 = require("../entities/obra.entity");
const pagina_entity_1 = require("../entities/pagina.entity");
const personaje_entity_1 = require("../entities/personaje.entity");
const tipo_entity_1 = require("../entities/tipo.entity");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mongodb",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE,
    synchronize: false,
    //logging: false,
    entities: [
        artista_entity_1.Artista,
        pageArtista_entity_1.PageArtista,
        etiqueta_entity_1.Etiqueta,
        grupo_entity_1.Grupo,
        lenguaje_entity_1.Lenguaje,
        obra_entity_1.Obra,
        pagina_entity_1.Pagina,
        personaje_entity_1.Personaje,
        tipo_entity_1.Tipo,
        serie_entity_1.Serie
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
