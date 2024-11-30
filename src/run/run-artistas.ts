import { logger } from "..";
import { AppDataSource, AppDataSourceMysql } from "../config/database";
import { Artista } from "../entities/artista.entity";
import { Dato } from "../entities/data.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { scrapingPerArtista } from "../scraping/scraping-artistas";
import { convertJson } from "../utils/conversiones";

export async function init(url: string) {
    const datos = await scrapingPerArtista(url)
    /* await AppDataSource.initialize();
    const insertBulk = await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Artista)
        .values(datos)
        .execute();
    console.log('finalizacion: ', datos)
    await AppDataSource.destroy(); */
    return datos
}

export async function initializePage() {
    const pages_artista: PageArtista[] = [
        {
            href: '/allartists-123.html',
            nombre: '123',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-a.html',
            nombre: 'a',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-b.html',
            nombre: 'b',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-c.html',
            nombre: 'c',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-d.html',
            nombre: 'd',
            datos: [],
            fechaCreacion: new Date
        },

        {
            href: '/allartists-e.html',
            nombre: 'e',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-f.html',
            nombre: 'f',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-g.html',
            nombre: 'g',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-h.html',
            nombre: 'h',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-i.html',
            nombre: 'i',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-j.html',
            nombre: 'j',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-k.html',
            nombre: 'k',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-l.html',
            nombre: 'l',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-m.html',
            nombre: 'm',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-n.html',
            nombre: 'n',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-o.html',
            nombre: 'o',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-p.html',
            nombre: 'p',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-q.html',
            nombre: 'q',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-r.html',
            nombre: 'r',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-s.html',
            nombre: 's',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-t.html',
            nombre: 't',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-u.html',
            nombre: 'u',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-v.html',
            nombre: 'v',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-w.html',
            nombre: 'w',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-x.html',
            nombre: 'x',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-y.html',
            nombre: 'y',
            datos: [],
            fechaCreacion: new Date
        },
        {
            href: '/allartists-z.html',
            nombre: 'z',
            datos: [],
            fechaCreacion: new Date
        },
    ]
    const resultados: PageArtista[] = [];

    await AppDataSourceMysql.initialize();

    for (const page of pages_artista) {
        const datos = await init(page.href)

        const insertPagina = await AppDataSourceMysql.getRepository(PageArtista)
            .insert({
                ...page,
                cantidad: datos.length
            });

        logger.info(`insertDato ... ${convertJson(insertPagina.generatedMaps[0])}`)

        const pagina = insertPagina.generatedMaps[0] as PageArtista;

        datos.map((dato) => {
            dato.pagina_id = pagina.pagina_id
        })

        const insertDato = await AppDataSourceMysql.getRepository(Dato)
            .insert(datos);
        logger.info(`insertDato ... ${convertJson(insertDato.generatedMaps[0])}`)
    }
    await AppDataSourceMysql.destroy();

    logger.info(`Scraping finalizado ... ${convertJson(resultados)}`)
}
