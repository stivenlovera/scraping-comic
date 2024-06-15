import { logger } from "..";
import { AppDataSource } from "../config/database";
import { Obra } from "../entities/obra.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { createFolder, scrapingArtista, scrapingObra, scrapingPaginaImage, scrapingPerPaginaImage } from "../scraping/scraping-artista";
import { convertJson } from "../utils/conversiones";
import 'dotenv/config';

async function run(url: string) {
    const doujins = await scrapingArtista(url)
    return doujins;
}

export async function inizialize() {
    await AppDataSource.initialize();
    const pageArtistas = await AppDataSource.getRepository(PageArtista).find({ take: 1 });
    logger.info(`artistas almacenado en base de datos :${convertJson(pageArtistas)}`)

    let obras_extraidas = [];
    for (const page of pageArtistas) {
        let index: number = 0;
        for (const artista of page.artistas) {
            if (index > 6) {
                logger.info(`autor numero ${index} artista :${convertJson(artista)}`)
                const obras = await run(artista.href)
                logger.info(`cantidad de obras del artista ${artista.nombre} extraidas :${obras.length}`)
                const InfoObras = await runObras(obras);
                obras_extraidas.push(InfoObras);
            }
            index++;
        }
        break;
    }
    logger.info(`Finalizando script :${convertJson(obras_extraidas)}`)
}

async function runObras(obras: Obra[]) {
    let resultados: Obra[] = []

    for (let index = 0; index < obras.length; index++) {
        if (index > 1) {
            const dato = await scrapingObra(obras[index].url_scraping, obras[index]);
            logger.info(`preparando obra numero ${index} obra: ${dato.nombre} codigo: ${dato.codigo}`)
            const pathOriginal = `${process.env.PATH_COMIC}/${dato.codigo}/original`;
            const pathSmall = `${process.env.PATH_COMIC}/${dato.codigo}/small`;
            const pathMedio = `${process.env.PATH_COMIC}/${dato.codigo}/medio`;
            const pathBig = `${process.env.PATH_COMIC}/${dato.codigo}/big`;
            await createFolder(dato.codigo, pathOriginal, pathSmall, pathMedio, pathBig)
            const completadoPaginas = await scrapingPerPaginaImage(dato, pathOriginal);

            resultados.push(completadoPaginas);
            //data base
            logger.info(`insertando obra :${convertJson(resultados)}`)
            const insertObra = await AppDataSource.getRepository(Obra).insert(completadoPaginas);
            logger.info(`resultado de insercion :${convertJson(insertObra)}`)
        }
    }

    return resultados;
}