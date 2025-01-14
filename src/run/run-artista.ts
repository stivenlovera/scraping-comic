import moment from "moment";
import { logger } from "..";
import { AppDataSource, AppDataSourceMysql } from "../config/database";
import { Dato } from "../entities/data.entity";
import { getAllLibro } from "../entities/getAllLibro";
import { Grupo } from "../entities/grupo.entity";
import { Lenguaje } from "../entities/lenguaje.entity";
import { Libro } from "../entities/libro.entity";
import { Obra } from "../entities/obra.entity";
import { PageArtista } from "../entities/pageArtista.entity";
import { Tipo } from "../entities/tipo.entity";
import { createFolder, scrapingArtista, scrapingObra, scrapingPaginaImage, scrapingPerPaginaImage } from "../scraping/scraping-artista";
import { convertJson } from "../utils/conversiones";
import 'dotenv/config';

async function run(url: string) {
    const doujins = await scrapingArtista(url)
    return doujins;
}

export async function inizialize() {
    const pagina = process.env.NUM_PAGINA;
    await AppDataSourceMysql.initialize();
    const mongoDB = await AppDataSource.initialize();
    const obras = await AppDataSourceMysql.query<getAllLibro[]>(`
           select * from (select dato.pagina_id, pagina.nombre as pagina_nombre, libro.dato_id, dato.nombre, libro.libro_id, libro.completed, libro.href, GROUP_CONCAT( libro.libro_id SEPARATOR ',') as ids_libros, GROUP_CONCAT(libro.href  SEPARATOR ',') as links, count( DISTINCT libro.libro_id ) as cantidad from dato inner join libro on libro.dato_id=dato.dato_id inner join pagina on pagina.pagina_id=dato.pagina_id group by libro.href
) as libro where libro.completed=0 and libro.pagina_id=${pagina}
        `);
    logger.info(`artistas almacenado en base de datos :${convertJson(obras.length)}`)

    let InitialStateObra: Obra = {
        nombre: "",
        numero_pagina: 0,
        fecha_scraping: "",
        fecha: moment().toDate(),
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

    for (let index = 0; index < obras.length; index++) {
        const obra = obras[index];
        try {
            logger.info(`abecedario:${obra.pagina_nombre} autor:${obra.nombre} libro_id:${obra.libro_id} url:${obra.href}`)
            const dato = await scrapingObra(obra.href, InitialStateObra);

            dato.codigo = `${moment().format('YYMMDDHHmmss')}-${obra.pagina_id}`;
            dato.fecha = moment().toDate();
            logger.info(`OBRA SCRAPIADA ${convertJson(moment().format('DD/MM/YYYY h:mm:ss a'))}`);

            const pathOriginal = `${process.env.PATH_COMIC}/${dato.codigo}/original`;
            const pathSmall = `${process.env.PATH_COMIC}/${dato.codigo}/small`;
            const pathMedio = `${process.env.PATH_COMIC}/${dato.codigo}/medio`;
            const pathBig = `${process.env.PATH_COMIC}/${dato.codigo}/big`;
            await createFolder(dato.codigo, pathOriginal, pathSmall, pathMedio, pathBig)
            const completadoPaginas = await scrapingPerPaginaImage(dato, pathOriginal);

            //data base
            logger.info(`insertando obra mongo`)
            const insertObra = await mongoDB.getRepository(Obra).insert(completadoPaginas);
            logger.info(`resultado de insercion correcto mongo: ${convertJson(insertObra.identifiers)}`)

            let libros_id = obra.ids_libros.split(',');
            const ids = libros_id.map((val) => parseInt(val))
            logger.info(`insertando id de actualizacion mysql: ${convertJson(ids)}`)
            await AppDataSourceMysql.getRepository(Libro).update(ids, {
                completed: 1
            });
            logger.info(`actualizacion de mysql: ${convertJson(ids)}`)
        } catch (error) {
            logger.error(`ERROR EN =>  abecedario:${obra.pagina_nombre} autor:${obra.nombre} libro_id:${obra.libro_id} url:${obra.href}` + error)
            if (error == 'Error: ERROR DE PAGINA SALTANDO A LA PROXIMA') {
                logger.error(error)
            }
            else {
                logger.error(`REINTENTANDO...`)
                index = index - 1
            }
        }
        finally {

        }
    }
    logger.info(`script finalizado`)
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
            logger.info(`insertando obra en mongo`)
            const insertObra = await mongoDB.getRepository(Obra).insert(completadoPaginas);
            logger.info(`resultado de insercion correcto mongo: ${convertJson(insertObra.identifiers)}`)


            await AppDataSourceMysql.getRepository(Libro).update(libros[index].libro_id!, {
                completed: 1
            });
            //}
        } else {
            logger.info(`OBRA YA EXISTE`, libros[index].href);
        }

    }

}