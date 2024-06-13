import puppeteer from 'puppeteer';
import { Obra } from '../entities/obra.entity';
import 'dotenv/config';
import { logger } from '..';
import moment from 'moment';
import { Pagina } from '../entities/pagina.entity';
import * as fs from 'fs'
import { stringToFormat } from '../utils/conversiones';
import sharp from 'sharp';

export async function scrapingArtista(url: string): Promise<Obra[]> {
    const baseUrl = process.env.URL_SCRAPING;
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    });
    const page = await browser.newPage();

    logger.info(`Scrapeando ${url}`);
    await page.goto(url);

    const resultados = await page.evaluate(({ baseUrl }) => {
        const contenido = document.querySelectorAll('a.lillie');
        const data = [...contenido].map((ele) => {
            let datos: Obra = {
                codigo: '',
                grupo: {
                    nombre: ''
                },
                fecha: new Date(),
                fecha_scraping: '',
                numero_pagina: 0,
                lenguaje: {
                    nombre: ''
                },
                tipo: {
                    nombre: ''
                },
                nombre: '',
                paginas: [],
                url_scraping: baseUrl + ele.getAttribute('href')!,
                artistas: [],
                etiquetas: [],
                personajes: [],
                series: []
            };
            return datos;
        })
        return data;
    }, { baseUrl })

    //await page.screenshot({ path: 'capturas/hitomi.png' })
    await browser.close();
    return resultados;
}


export async function scrapingObra(url: string, dato: Obra): Promise<Obra> {
    const baseUrl = process.env.URL_SCRAPING;
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    });

    logger.info(`Scrapeando informacion de obra ${url}`);
    const page = await browser.newPage();

    await page.goto(url);

    const obra = await page.evaluate(({ dato, baseUrl }) => {
        dato.nombre = document.getElementById('gallery-brand')!.querySelector('a')!.innerText;

        dato.grupo = {
            nombre: document.getElementById('groups')!.innerText
        };

        const tipo = document.querySelectorAll('#type');
        const dataTipo = [...tipo].map((ele) => {
            dato.tipo = {
                nombre: ele.querySelector('a')!.innerText
            }
        })

        const artistas = document.querySelectorAll('#artists>ul.comma-list');
        const dataArtista = [...artistas].map((ele) => {
            const li = ele.querySelectorAll('li');
            const dataLi = [...li].map((li) => {
                dato.artistas.push({
                    nombre: li.querySelector('a')!.innerText,
                    cantidad: 0,
                    href: ''
                })
                return li.querySelector('a')!.innerText;
            })
            return dataLi
        });

        const lenguaje = document.querySelectorAll('#language');
        [...lenguaje].map((ele) => {
            dato.lenguaje = {
                nombre: ele.querySelector('a')!.innerText/*  */
            };
        })

        const personajes = document.querySelectorAll('#characters');
        [...personajes].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                dato.personajes.push({
                    nombre: li.querySelector('a')!.innerText
                });
            })
        })

        const etiquetas = document.querySelectorAll('#tags');
        [...etiquetas].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                dato.etiquetas.push({
                    nombre: (li.querySelector('a')!.innerText).replace(/[^a-zA-Z0-9 ]/g, '').trim()
                });
            })
        })

        const series = document.querySelectorAll('#series ul.comma-list');
        [...series].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                dato.series.push({
                    nombre: li.querySelector('a')!.innerText
                });
            })
        })

        const fecha = document.querySelectorAll('span.date');
        [...fecha].map((ele) => {

            dato.fecha_scraping = ele.innerHTML;
        })

        const paginas = document.querySelectorAll('.thumbnail-list');
        [...paginas].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li, i) => {
                const aux = li.querySelector('a');
                dato.paginas.push({
                    url_scraping: baseUrl + aux?.getAttribute('href')!,
                    numero: i + 1,
                    url_big: '',
                    url_medio: '',
                    url_small: '',
                    data_scraping: '',
                    url_original: ''
                })
            })
            dato.numero_pagina = [...li].length
            console.log('cantidad paginas', [...li].length)
        })
        return dato;
    }, { dato, baseUrl });

    //await page.screenshot({ path: 'capturas/hitomi.png' })
    await browser.close();

    //FOLDER CREATE
    const nombre = moment().format('YYMMDDHHmmss');
    obra.codigo = nombre;
    obra.fecha = moment(obra.fecha_scraping, 'D MMM YYYY, hh:mm').toDate();

    return obra;
}

export async function scrapingPaginaImage(resultados: Obra, pathOriginal: string, pathSmall: string, pathMedio: string, pathBig: string) {

    let paginas: Pagina[] = [];

    for (const pagina of resultados.paginas) {
        const browserPagina = await puppeteer.launch({
            headless: false,
            slowMo: 400
        });

        logger.info(`Scrapeando informacion imagen ${pagina.url_scraping}`);
        const page = (await browserPagina.pages())[0]
        const get = await page.goto(pagina.url_scraping)
        const image = await page.waitForSelector('img[src][class="lillie"]')
        const imgURL = await image!.evaluate(img => img.getAttribute('src'))
        const pageNew = await browserPagina.newPage()
        const response = await pageNew.goto(imgURL!, { timeout: 0, waitUntil: 'networkidle0' })
        const imageBuffer = await response!.buffer();

        logger.info(`IMAGEN ${imgURL}`);
        const formato = stringToFormat(imgURL!)
        logger.info(`GUARDAR DATOS ${pathOriginal}/${pagina.numero}.${formato}`);

        await fs.promises.writeFile(`${pathOriginal}/${pagina.numero}.${formato}`, imageBuffer)

        const pathStorageBig = await OptimizarBig(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathBig)
        const pathStorageMedio = await OptimizarMedio(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathMedio)
        const pathStorageSmall = await OptimizarSmall(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathSmall)

        paginas.push({
            ...pagina,
            url_big: pathStorageBig.replace(process.env.PATH_COMIC!, ''),
            url_medio: pathStorageMedio.replace(process.env.PATH_COMIC!, ''),
            url_small: pathStorageSmall.replace(process.env.PATH_COMIC!, ''),
            url_original: `${pathOriginal.replace(process.env.PATH_COMIC!, '')}/${pagina.numero}.${formato}`,
            data_scraping: imgURL!
        })

        await page.close()
        await browserPagina.close();

        break;
    }
    resultados.paginas = paginas
    return resultados;
}

export async function createFolder(codigo: string, pathOriginal: string, pathSmall: string, pathMedio: string, pathBig: string) {
    const path = `./comics`;
    if (!fs.existsSync(`${path}/${codigo}`)) {
        fs.mkdirSync(`${path}/${codigo}`);
        fs.mkdirSync(pathOriginal);
        fs.mkdirSync(pathSmall);
        fs.mkdirSync(pathMedio);
        fs.mkdirSync(pathBig);
    }
}

export async function OptimizarBig(pathImagen: string, nameFile: string, pathBig: string): Promise<string> {
    logger.info(`convirtiendo a avif Big desde ${pathImagen} a ${`${pathBig}/${nameFile}.avif`}`);
    const minifizar = await sharp(pathImagen)
        .avif()
        .toFile(`${pathBig}/${nameFile}.avif`)
    return `${`${pathBig}/${nameFile}.avif`}`;
}

export async function OptimizarMedio(pathImagen: string, nameFile: string, pathMedio: string): Promise<string> {
    logger.info(`convirtiendo a avif Medio desde ${pathImagen} a ${`${pathMedio}/${nameFile}.avif`}`);
    const minifizar = await sharp(pathImagen)
        .resize(250)
        .avif()
        .toFile(`${pathMedio}/${nameFile}.avif`)
    return `${pathMedio}/${nameFile}.avif`;
}

export async function OptimizarSmall(pathImagen: string, nameFile: string, pathSmall: string): Promise<string> {
    logger.info(`convirtiendo a avif Small desde ${pathImagen} a ${`${pathSmall}/${nameFile}.avif`}`);
    const minifizar = await sharp(pathImagen)
        .resize(100)
        .avif()
        .toFile(`${pathSmall}/${nameFile}.avif`)
    return `${pathSmall}/${nameFile}.avif`
}