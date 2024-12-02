import { logger } from "..";
import { AppDataSource, AppDataSourceMysql } from "../config/database";
import { Dato } from "../entities/data.entity";
import { Grupo } from "../entities/grupo.entity";
import { Lenguaje } from "../entities/lenguaje.entity";
import { Libro } from "../entities/libro.entity";
import { Obra } from "../entities/obra.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { Tipo } from "../entities/tipo.entity";
import { createFolder, scrapingArtista, scrapingObra, scrapingPaginaImage, scrapingPerPaginaImage } from "../scraping/scraping-artista";
import { convertJson } from "../utils/conversiones";
import 'dotenv/config';
import player from 'play-sound'

async function run(url: string) {
    const doujins = await scrapingArtista(url)
    return doujins;
}

export async function inizialize() {
    logger.info(`AppDataSourceMysql`)
    //await AppDataSource.initialize();
    await AppDataSourceMysql.initialize();

    const letras = await AppDataSourceMysql.getRepository(PageArtista).find();
    //logger.info(`artistas almacenado en base de datos :${convertJson(letras)}`)

    for (const letra of letras) {
        const pageArtistas = await AppDataSourceMysql.getRepository(PageArtista).find({ where: { nombre: letra.nombre } });

        //logger.info(`autores :${convertJson(pageArtistas)}`)

        for (const page of pageArtistas) {

            const datos = await AppDataSourceMysql.getRepository(Dato).find({ where: { pagina_id: page.pagina_id } });

            //logger.info(`autores :${convertJson(datos)}`)

            let index: number = 0;
            for (const artista of datos) {
                //buscar el ultimO
                //if (index > 182) {
                    try {
                        logger.info(`autor numero ${index} page :${convertJson(page.nombre)} artista :${convertJson(artista.nombre)} }`)
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
                    } catch (error) {
                        logger.info(`ultimo registro ${index}`);
                        player().play('sonido/alerta.mp3', { timeout: 5000 }, (error) => {
                            console.log(error)
                        })
                    }
                //}
                //const InfoObras = await runObras(obras);
                //obras_extraidas.push(InfoObras);
                index++;
            }
        }
        logger.info(`Finalizando script`)
    }

}

export async function inizializeLibros() {
    await AppDataSourceMysql.initialize();
    const mongoDB = await AppDataSource.initialize();
    const libros = await AppDataSourceMysql.getRepository(Libro).find({ order: { libro_id: 'ASC' } });
    logger.info(`libros: ${convertJson(libros)} `)
    let resultados: Obra[] = []
    let obra: Obra = {
        nombre: "",
        numero_pagina: 0,
        fecha_scraping: "",
        fecha: new Date,
        tipo: new Tipo,
        grupo: new Grupo,
        lenguaje: new Lenguaje,
        url_scraping: "",
        artistas: [],
        personajes: [],
        series: [],
        paginas: [],
        etiquetas: [],
        codigo: ""
    }

    for (let index = 0; index < libros.length; index++) {

        const verificar = await mongoDB.getRepository(Obra).findOne({ where: { url_scraping: libros[index].href.toString() } });
        logger.info(`OBRA `, obra);
        logger.info(`comparando: ${convertJson(libros[index].href.toString())} `)
        if (verificar === null) {
            logger.info(`OBRA NUEVO`, libros[index].href);
            const dato = await scrapingObra(libros[index].href, obra);
            logger.info(`OBRA SCRAPIADA ${convertJson(dato)}`);
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

            await AppDataSourceMysql.getRepository(Libro).update(libros[index].libro_id!, {
                completed: 1
            });
            //}
        } else {
            logger.info(`OBRA YA EXISTE`, libros[index].href);
        }

    }

}