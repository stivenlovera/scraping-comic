import { logger } from "..";
import { AppDataSource } from "../config/database";
import { Artista } from "../entities/artista.entity";
import { Obra } from "../entities/obra.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { createFolder, scrapingArtista, scrapingObra, scrapingPaginaImage } from "../scraping/scraping-artista";
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
        let index: number = 0;
        for (const artista of page.artistas) {
            if (index > 1) {
                logger.info(`autor :${convertJson(artista)}`)
                const obras = await run(artista.href)
                logger.info(`obras extraidas :${convertJson(obras)}`)
                const InfoObras = await runObras(obras);
                obras_extraidas.push(InfoObras);
            }
            index++
        }
    }
    logger.info(`Finalizando script :${convertJson(obras_extraidas)}`)
}

async function runObras(obras: Obra[]) {
    let resultados: Obra[] = []

    let count = 0;

    for (const obra of obras) {

        if (count>1) { //delete
            const dato = await scrapingObra(obra.url_scraping, obra);

            const pathOriginal = `${process.env.PATH_COMIC}/${dato.codigo}/original`;
            const pathSmall = `${process.env.PATH_COMIC}/${dato.codigo}/small`;
            const pathMedio = `${process.env.PATH_COMIC}/${dato.codigo}/medio`;
            const pathBig = `${process.env.PATH_COMIC}/${dato.codigo}/big`;
            await createFolder(dato.codigo, pathOriginal, pathSmall, pathMedio, pathBig)
            const completadoPaginas = await scrapingPaginaImage(dato, pathOriginal, pathSmall, pathMedio, pathBig);

            resultados.push(completadoPaginas);
            //data base
            logger.info(`insertando obra :${convertJson(resultados)}`)
            const insertObra = await AppDataSource.getRepository(Obra).insert(completadoPaginas);
            logger.info(`resultado de insercion :${convertJson(insertObra)}`)
        }

        count++;
    }

    return resultados;
}