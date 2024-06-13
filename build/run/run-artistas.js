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
exports.initializePage = exports.init = void 0;
const __1 = require("..");
const database_1 = require("../config/database");
const pageArtista_entity_1 = require("../entities/pageArtista.entity");
const scraping_artistas_1 = require("../scraping/scraping-artistas");
const conversiones_1 = require("../utils/conversiones");
function init(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const artistas = yield (0, scraping_artistas_1.scrapingPerArtista)(url);
        /* await AppDataSource.initialize();
        const insertBulk = await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Artista)
            .values(artistas)
            .execute();
        console.log('finalizacion: ', artistas)
        await AppDataSource.destroy(); */
        return artistas;
    });
}
exports.init = init;
function initializePage() {
    return __awaiter(this, void 0, void 0, function* () {
        const pages_artista = [
            {
                href: '/allartists-123.html',
                nombre: '123',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-a.html',
                nombre: 'a',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-b.html',
                nombre: 'b',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-c.html',
                nombre: 'c',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-d.html',
                nombre: 'd',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-e.html',
                nombre: 'e',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-f.html',
                nombre: 'f',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-g.html',
                nombre: 'g',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-h.html',
                nombre: 'h',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-i.html',
                nombre: 'i',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-j.html',
                nombre: 'j',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-k.html',
                nombre: 'k',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-l.html',
                nombre: 'l',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-m.html',
                nombre: 'm',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-n.html',
                nombre: 'n',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-o.html',
                nombre: 'o',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-p.html',
                nombre: 'p',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-q.html',
                nombre: 'q',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-r.html',
                nombre: 'r',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-s.html',
                nombre: 's',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-t.html',
                nombre: 't',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-u.html',
                nombre: 'u',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-v.html',
                nombre: 'v',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-w.html',
                nombre: 'w',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-x.html',
                nombre: 'x',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-y.html',
                nombre: 'y',
                artistas: [],
                fechaCreacion: new Date
            },
            {
                href: '/allartists-z.html',
                nombre: 'z',
                artistas: [],
                fechaCreacion: new Date
            },
        ];
        const resultados = [];
        for (const page of pages_artista) {
            const artistas = yield init(page.href);
            resultados.push(Object.assign(Object.assign({}, page), { artistas: artistas }));
        }
        yield database_1.AppDataSource.initialize();
        const insert = yield database_1.AppDataSource.getRepository(pageArtista_entity_1.PageArtista)
            .insert(resultados);
        yield database_1.AppDataSource.destroy();
        __1.logger.info(`Insertando ... ${(0, conversiones_1.convertJson)(insert.identifiers)}`);
        __1.logger.info(`Scraping finalizado ... ${(0, conversiones_1.convertJson)(resultados)}`);
    });
}
exports.initializePage = initializePage;
