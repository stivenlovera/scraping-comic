console.log('web scraping https://hitomi.la/allartists-123.html ');
import puppeteer from 'puppeteer';
import { Artista } from '../entities/artista.entity';
import 'dotenv/config';
import { logger } from '..';

export async function scrapingPerArtista(url: string) {
    const baseUrl = process.env.URL_SCRAPING;
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    });

    logger.info(`Scrapeando ${baseUrl + url}`);
    const page = await browser.newPage();
    await page.goto(baseUrl + url);
    const artistas: Artista[] =[];
    
    const resultados = await page.evaluate(({ baseUrl,artistas }) => {
        const contenido = document.querySelectorAll('.posts');
        const datos = [...contenido].map((ul) => {
            const li = ul.querySelectorAll('li');

            const etiquetas = [...li].map((etiqueta, i) => {
                const rango = etiqueta.innerText.trim().split(' ')
                const nuevaCadena = rango[rango.length - 1]
                artistas.push({
                    nombre: etiqueta.querySelector('a')?.innerText!,
                    href: `${baseUrl}${etiqueta.querySelector('a')?.getAttribute('href')!}`,
                    cantidad: parseInt(nuevaCadena.replace('(', '').replace(')', ''))
                })
            });
            return etiquetas;
        })
        return artistas;
    }, { baseUrl,artistas })

    //await page.screenshot({ path: 'capturas/hitomi.png' })
    await browser.close();
    return resultados;
}

function filtroArray(array: Artista[][]): Artista[] {
    let resultado: Artista[] = [];
    let total: number = 0
    array.map((e: Artista[]) => {
        e.map((a: Artista) => {
            console.log(a);
            total = total + a.cantidad;
            resultado.push(a);
        });

    })
    console.log('total: ', total);
    return resultado
}



