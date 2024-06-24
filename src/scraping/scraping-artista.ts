
import { Obra } from '../entities/obra.entity';
import 'dotenv/config';
import { logger } from '..';
import moment from 'moment';
import { Pagina } from '../entities/pagina.entity';
import * as fs from 'fs'
import { convertJson, stringToFormat } from '../utils/conversiones';
import sharp from 'sharp';
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import { Browser } from 'puppeteer';
import player from 'play-sound'

export async function scrapingArtista(url: string): Promise<Obra[]> {
    const baseUrl = process.env.URL_SCRAPING;
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    });
    const page = await browser.newPage();

    logger.info(`Scrapeando para paginacion ${url}`);
    await page.goto(url);

    let paginacion: string[] = []
    paginacion.push(url);

    const pagEncontradas = await page.evaluate(({ baseUrl }) => {
        let paginasEncontradas: string[] = [];
        const paginas = document.querySelectorAll('div.page-container.page-top>ul');
        [...paginas].map((p, i) => {
            const pag = p.querySelectorAll('li');
            [...pag].map((li, i) => {
                const url = li.querySelector('a')?.getAttribute('href')!;
                if (url != undefined) {
                    paginasEncontradas.push(baseUrl + li.querySelector('a')?.getAttribute('href')!);
                }
            })
        });
        return paginasEncontradas;
    }, { baseUrl });

    paginacion = paginacion.concat(pagEncontradas)

    await browser.close();
    //paginas actual añadida
    let obras: Obra[] = []
    logger.info(`paginas ${convertJson(paginacion)}`);
    for (const pagina of paginacion) {
        const nuevaPag = await scrapingPerPagina(pagina)
        obras = obras.concat(nuevaPag);
    }
    //await page.screenshot({ path: 'capturas/hitomi.png' })
    return obras;
}

export async function scrapingPerPagina(url: string): Promise<Obra[]> {
    const baseUrl = process.env.URL_SCRAPING;
    const pagBrowser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    });
    const pag = await pagBrowser.newPage();

    logger.info(`Scrapeando en obras en pagina ${url}`);
    await pag.goto(url);
    await pag.waitForSelector('a.lillie')
    const resultados = await pag.evaluate(({ baseUrl }) => {
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
    logger.info(`obras encontradas ${resultados.length}`);
    await pagBrowser.close();
    return resultados;
};


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
        console.log('nombre')
        dato.grupo = {
            nombre: document.getElementById('groups')!.innerText
        };
        console.log('grupo')
        const tipo = document.querySelectorAll('#type');
        const dataTipo = [...tipo].map((ele) => {
            dato.tipo = {
                nombre: ele.querySelector('a')!.innerText
            }
        })
        console.log('tipo')
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
        console.log('artistas')
        const lenguaje = document.querySelectorAll('#language');
        [...lenguaje].map((ele) => {
            if (ele.querySelector('a')?.innerText != null || ele.querySelector('a')?.innerText != undefined) {
                dato.lenguaje = {
                    nombre: ele.querySelector('a')!.innerText
                };
            }
        })
        console.log('lenguaje')
        const personajes = document.querySelectorAll('#characters');
        [...personajes].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                if (li.querySelector('a')?.innerText != undefined || li.querySelector('a')?.innerText != null) {
                    dato.personajes.push({
                        nombre: li.querySelector('a')!.innerText
                    });
                }
            })
        })
        console.log('personajes')
        const etiquetas = document.querySelectorAll('#tags');
        [...etiquetas].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                if ((li.querySelector('a')?.innerText) != null || (li.querySelector('a')?.innerText) != undefined) {
                    dato.etiquetas.push({
                        nombre: (li.querySelector('a')!.innerText).replace(/[^a-zA-Z0-9 ]/g, '').trim()
                    });
                }
            })
        })
        console.log('etiquetas')
        const series = document.querySelectorAll('#series ul.comma-list');
        [...series].map((ele) => {
            const li = ele.querySelectorAll('li');
            [...li].map((li) => {
                dato.series.push({
                    nombre: li.querySelector('a')!.innerText
                });
            })
        })
        console.log('series')
        const fecha = document.querySelectorAll('span.date');
        [...fecha].map((ele) => {
            dato.fecha_scraping = ele.innerHTML;
        })
        console.log('fecha')
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
        console.log('paginas final')
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
        const imgURL = await image!.evaluate(img => {
            img.getAttribute('src')
            const picture = document.querySelectorAll('#comicImages>picture')[0]
            const srcset = picture.children.item(0)?.getAttribute('srcset')
            const src = picture.children.item(0)?.getAttribute('src')
            if (srcset == null) {
                return src
            } else {
                return srcset
            }
        })
        const pageNew = await browserPagina.newPage()
        const response = await pageNew.goto(imgURL!, { timeout: 0, waitUntil: 'networkidle0' })
        const imageBuffer = await response!.buffer();

        logger.info(`IMAGEN ${imgURL}`);
        const formato = stringToFormat(imgURL!)
        logger.info(`GUARDAR DATOS ${pathOriginal}/${pagina.numero}.${formato}`);

        await fs.promises.writeFile(`${pathOriginal}/${pagina.numero}.${formato}`, imageBuffer);

        try {

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
        } catch (error) {
            paginas.push({
                ...pagina,
                url_big: 'error encontrado',
                url_medio: 'error encontrado',
                url_small: 'error encontrado',
                url_original: `${pathOriginal.replace(process.env.PATH_COMIC!, '')}/${pagina.numero}.${formato}`,
                data_scraping: imgURL!
            })
        }

        await page.close()
        await browserPagina.close();
    }
    resultados.paginas = paginas
    return resultados;
}

export async function scrapingPerPaginaImage(resultados: Obra, pathOriginal: string) {
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
    let paginas: Pagina[] = [];

    const url = resultados.paginas[0].url_scraping
    const browserPagina = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });

    logger.info(`Scrapeando informacion imagen ${url}`);
    const page = await browserPagina.newPage();
    await page.goto(url);

    for (let index = 1; index < 10000; index++) {

        logger.info(`pagina ${index}`);
        await page.waitForSelector('img[src][class="lillie"]')
        const imgURL = await page!.evaluate(() => {
            const picture = document.querySelectorAll('#comicImages>picture')[0]
            const srcset = picture.children.item(0)?.getAttribute('srcset')
            const src = picture.children.item(0)?.getAttribute('src')
            if (srcset == null) {
                return src
            } else {
                return srcset
            }
        })
        logger.info(`url de descarga ${imgURL}`);
        const formato = stringToFormat(imgURL!)
        await proceso_descarga(browserPagina, imgURL, pathOriginal, index, paginas, formato);

        /* const pageNew = await browserPagina.newPage()
        const response = await pageNew.goto(imgURL!, { timeout: 5000000, waitUntil: 'networkidle0' })
        const imageBuffer = await response!.buffer();
        

        await fs.promises.writeFile(`${pathOriginal}/${index}.${formato}`, imageBuffer);
        logger.info(`imagen descargada ${pathOriginal}/${index}.${formato}`);

        paginas.push({
            url_scraping: imgURL!,
            numero: index,
            url_big: '',
            url_medio: '',
            url_small: '',
            url_original: `${pathOriginal.replace(process.env.PATH_COMIC!, '')}/${index}.${formato}`,
            data_scraping: imgURL!
        })

        pageNew.close(); */

        const validate = await page!.evaluate(() => {
            if (document.querySelector('#nextPanel>i.icon-chevron-left.icon-white')?.isConnected) {
                return true;
            } else {
                return false;
            }
        });

        if (validate) {
            logger.info(`siguiente pagina ${validate}`);
            await page.click('#nextPanel')
        } else {
            logger.info(`ultima pagina ${resultados.numero_pagina}`);
            resultados.numero_pagina = index;
            break;
        }
    }

    resultados.paginas = paginas;
    await page.close()
    await browserPagina.close();

    return resultados;
}

export async function createFolder(codigo: string, pathOriginal: string, pathSmall: string, pathMedio: string, pathBig: string) {
    const path = `./comics`;
    if (!fs.existsSync(`${path}/${codigo}`)) {
        fs.mkdirSync(`${path}/${codigo}`);
        fs.mkdirSync(pathOriginal);
        /* fs.mkdirSync(pathSmall);
        fs.mkdirSync(pathMedio);
        fs.mkdirSync(pathBig); */
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


async function proceso_descarga(browserPagina: Browser, imgURL: string | null | undefined, pathOriginal: string, index: number, paginas: Pagina[], formato: string) {

    let detectError: boolean = false;
    let intentos: number = 0;
    while (!detectError) {
        intentos++;
        try {
            logger.info(`preparando descarga desde ${imgURL}`);

            const pageNew = await browserPagina.newPage()
            const response = await pageNew.goto(imgURL!, { timeout: 5000000, waitUntil: 'networkidle0' })
            const imageBuffer = await response!.buffer();
        
            await fs.promises.writeFile(`${pathOriginal}/${index}.${formato}`, imageBuffer);
            logger.info(`imagen descargada ${pathOriginal}/${index}.${formato}`);
        
            paginas.push({
                url_scraping: imgURL!,
                numero: index,
                url_big: '',
                url_medio: '',
                url_small: '',
                url_original: `${pathOriginal.replace(process.env.PATH_COMIC!, '')}/${index}.${formato}`,
                data_scraping: imgURL!
            })
        
            pageNew.close();

            break;
        } catch (error) {
            logger.info(`error generado ${error}`);
            logger.info(`intentos ${intentos}`);
            player().play('sonido/alerta.mp3', { timeout: 5000 }, (error) => {
                console.log(error)
            })
            detectError = false;

        }
    }

    return paginas;
}