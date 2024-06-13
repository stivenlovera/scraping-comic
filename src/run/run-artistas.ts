import { logger } from "..";
import { AppDataSource } from "../config/database";
import { Artista } from "../entities/artista.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { scrapingPerArtista } from "../scraping/scraping-artistas";
import { convertJson } from "../utils/conversiones";

export async function init(url: string) {
    const artistas = await scrapingPerArtista(url)
    /* await AppDataSource.initialize();
    const insertBulk = await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Artista)
        .values(artistas)
        .execute();
    console.log('finalizacion: ', artistas)
    await AppDataSource.destroy(); */
    return artistas
}

export async function initializePage() {
    const pages_artista: PageArtista[] = [
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
    ]
    const resultados: PageArtista[] = [];

    for (const page of pages_artista) {

        const artistas = await init(page.href)
        resultados.push({
            ...page,
            artistas: artistas
        })
    }

    await AppDataSource.initialize();

    const insert = await AppDataSource.getRepository(PageArtista)
        .insert(resultados);
    await AppDataSource.destroy();
    logger.info(`Insertando ... ${convertJson(insert.identifiers)}`)
    logger.info(`Scraping finalizado ... ${convertJson(resultados)}`)
}
