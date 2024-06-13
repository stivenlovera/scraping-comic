"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inizialize = void 0;
const __1 = require("..");
const database_1 = require("../config/database");
const obra_entity_1 = require("../entities/obra.entity");
const pageArtista_entity_1 = require("../entities/pageArtista.entity");
const scraping_artista_1 = require("../scraping/scraping-artista");
const conversiones_1 = require("../utils/conversiones");
require("dotenv/config");
function run(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const doujins = yield (0, scraping_artista_1.scrapingArtista)(url);
        return doujins;
    });
}
function inizialize() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.AppDataSource.initialize();
        const pageArtistas = yield database_1.AppDataSource.getRepository(pageArtista_entity_1.PageArtista).find({ take: 1 });
        __1.logger.info(`artistas almacenado en base de datos :${(0, conversiones_1.convertJson)(pageArtistas)}`);
        /*  await AppDataSource.initialize();
         const artistaRepository = AppDataSource.getRepository(Artista)
         const obras = await artistaRepository.find({
             relations: {
                 artistaObras: true,
             },
             take:1
         })
         console.log('resultado', obras) */
        /* const data = await AppDataSource.getRepository(Artista)
            .createQueryBuilder("artista")
            .leftJoinAndSelect("artista.artistaObras", "artista_obra")
            .leftJoinAndSelect("artista_obra.obraArtista", "obra")
            .limit(2)
            .getMany();
    
        AppDataSource.destroy();
        logger.info(`data :${convertJson(data)}`) */
        let obras_extraidas = [];
        for (const page of pageArtistas) {
            let index = 0;
            for (const artista of page.artistas) {
                __1.logger.info(`autor :${(0, conversiones_1.convertJson)(artista)}`);
                const obras = yield run(artista.href);
                __1.logger.info(`obras extraidas :${(0, conversiones_1.convertJson)(obras)}`);
                const InfoObras = yield runObras(obras);
                obras_extraidas.push(InfoObras);
            }
            break;
        }
        __1.logger.info(`Finalizando script :${(0, conversiones_1.convertJson)(obras_extraidas)}`);
    });
}
exports.inizialize = inizialize;
function runObras(obras) {
    return __awaiter(this, void 0, void 0, function* () {
        let resultados = [];
        for (const obra of obras) {
            const dato = yield (0, scraping_artista_1.scrapingObra)(obra.url_scraping, obra);
            const pathOriginal = `${process.env.PATH_COMIC}/${dato.codigo}/original`;
            const pathSmall = `${process.env.PATH_COMIC}/${dato.codigo}/small`;
            const pathMedio = `${process.env.PATH_COMIC}/${dato.codigo}/medio`;
            const pathBig = `${process.env.PATH_COMIC}/${dato.codigo}/big`;
            yield (0, scraping_artista_1.createFolder)(dato.codigo, pathOriginal, pathSmall, pathMedio, pathBig);
            const completadoPaginas = yield (0, scraping_artista_1.scrapingPaginaImage)(dato, pathOriginal, pathSmall, pathMedio, pathBig);
            resultados.push(completadoPaginas);
            //data base
            __1.logger.info(`insertando obra :${(0, conversiones_1.convertJson)(resultados)}`);
            const insertObra = yield database_1.AppDataSource.getRepository(obra_entity_1.Obra).insert(completadoPaginas);
            __1.logger.info(`resultado de insercion :${(0, conversiones_1.convertJson)(insertObra)}`);
        }
        return resultados;
    });
}
