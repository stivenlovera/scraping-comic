import { logger } from "..";
import { AppDataSource, AppDataSourceMysql } from "../config/database";
import { Dato } from "../entities/data.entity";
import { Libro } from "../entities/libro.entity";
import { Obra } from "../entities/obra.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { Seguimiento } from "../entities/seguimiento.entity";
import { createFolder, scrapingArtista, scrapingObra, scrapingPaginaImage, scrapingPerPaginaImage } from "../scraping/scraping-artista";
import { convertJson } from "../utils/conversiones";
import 'dotenv/config';

async function run(url: string) {
    const doujins = await scrapingArtista(url)
    return doujins;
}

export async function inizialize() {
    logger.info(`AppDataSourceMysql`)
    //await AppDataSource.initialize();
    await AppDataSourceMysql.initialize();

    const letras = await AppDataSourceMysql.getRepository(PageArtista).find();
    logger.info(`artistas almacenado en base de datos :${convertJson(letras)}`)

    let obras_extraidas = [];

    for (const letra of letras) {
        const pageArtistas = await AppDataSourceMysql.getRepository(PageArtista).find({ where: { nombre: letra.nombre } });

        logger.info(`autores :${convertJson(pageArtistas)}`)
        
        for (const page of pageArtistas) {

            const datos = await AppDataSourceMysql.getRepository(Dato).find({ where: { pagina_id: page.pagina_id } });

            logger.info(`autores :${convertJson(datos)}`)

            let index: number = 0;
            for (const artista of datos) {
                //buscar el ultimo

                logger.info(`autor numero ${index} artista :${convertJson(page.nombre)}`)
                const obras = await run(artista.href)

                logger.info(`cantidad de obras del artista ${artista.nombre} extraidas :${obras.length}`)

                const libro_estraido = obras.map<Libro>((obra) => {
                    return {
                        href: obra.url_scraping,
                        completed: 0,
                        dato_id: artista.dato_id
                    }
                })
                logger.info(`libros :${convertJson(libro_estraido)}`)
                const libro = await AppDataSourceMysql.getRepository(Libro).insert(libro_estraido);
                //const InfoObras = await runObras(obras);
                //obras_extraidas.push(InfoObras);
                index++;
            }

            break;
        }
        logger.info(`Finalizando script`)
    }

}

async function runObras(obras: Obra[]) {
    let resultados: Obra[] = []

    for (let index = 0; index < obras.length; index++) {
        //if (index > 10) {

        const verificar = await AppDataSource.getRepository(Obra).findOne({ where: { url_scraping: obras[index].url_scraping.toString() } });

        logger.info(`comparando: ${convertJson(obras[index].url_scraping)} `)
        if (verificar === null) {
            logger.info(`OBRA NUEVO`, obras[index].url_scraping);
            const dato = await scrapingObra(obras[index].url_scraping, obras[index]);
            logger.info(`preparando obra numero ${index} de autores ${convertJson(dato.artistas)} obra: ${dato.nombre} codigo: ${dato.codigo}`)
            const pathOriginal = `${process.env.PATH_COMIC}/${dato.codigo}/original`;
            const pathSmall = `${process.env.PATH_COMIC}/${dato.codigo}/small`;
            const pathMedio = `${process.env.PATH_COMIC}/${dato.codigo}/medio`;
            const pathBig = `${process.env.PATH_COMIC}/${dato.codigo}/big`;
            await createFolder(dato.codigo, pathOriginal, pathSmall, pathMedio, pathBig)
            const completadoPaginas = await scrapingPerPaginaImage(dato, pathOriginal);

            resultados.push(completadoPaginas);
            //data base
            logger.info(`insertando obra `)
            const insertObra = await AppDataSource.getRepository(Obra).insert(completadoPaginas);
            logger.info(`resultado de insercion correcto: ${convertJson(insertObra.identifiers)}`)
            //}
        } else {
            logger.info(`OBRA YA EXISTE`, obras[index].url_scraping);
        }

    }

    return resultados;
}