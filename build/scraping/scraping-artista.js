"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizarSmall = exports.OptimizarMedio = exports.OptimizarBig = exports.createFolder = exports.scrapingPaginaImage = exports.scrapingObra = exports.scrapingArtista = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
require("dotenv/config");
const __1 = require("..");
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
const conversiones_1 = require("../utils/conversiones");
const sharp_1 = __importDefault(require("sharp"));
function scrapingArtista(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = process.env.URL_SCRAPING;
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            slowMo: 400
        });
        const page = yield browser.newPage();
        __1.logger.info(`Scrapeando ${url}`);
        yield page.goto(url);
        const resultados = yield page.evaluate(({ baseUrl }) => {
            const contenido = document.querySelectorAll('a.lillie');
            const data = [...contenido].map((ele) => {
                let datos = {
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
                    url_scraping: baseUrl + ele.getAttribute('href'),
                    artistas: [],
                    etiquetas: [],
                    personajes: [],
                    series: []
                };
                return datos;
            });
            return data;
        }, { baseUrl });
        //await page.screenshot({ path: 'capturas/hitomi.png' })
        yield browser.close();
        return resultados;
    });
}
exports.scrapingArtista = scrapingArtista;
function scrapingObra(url, dato) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = process.env.URL_SCRAPING;
        // Launch the browser and open a new blank page
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            slowMo: 400
        });
        __1.logger.info(`Scrapeando informacion de obra ${url}`);
        const page = yield browser.newPage();
        yield page.goto(url);
        const obra = yield page.evaluate(({ dato, baseUrl }) => {
            dato.nombre = document.getElementById('gallery-brand').querySelector('a').innerText;
            dato.grupo = {
                nombre: document.getElementById('groups').innerText
            };
            const tipo = document.querySelectorAll('#type');
            const dataTipo = [...tipo].map((ele) => {
                dato.tipo = {
                    nombre: ele.querySelector('a').innerText
                };
            });
            const artistas = document.querySelectorAll('#artists>ul.comma-list');
            const dataArtista = [...artistas].map((ele) => {
                const li = ele.querySelectorAll('li');
                const dataLi = [...li].map((li) => {
                    dato.artistas.push({
                        nombre: li.querySelector('a').innerText,
                        cantidad: 0,
                        href: ''
                    });
                    return li.querySelector('a').innerText;
                });
                return dataLi;
            });
            const lenguaje = document.querySelectorAll('#language');
            [...lenguaje].map((ele) => {
                dato.lenguaje = {
                    nombre: ele.querySelector('a').innerText /*  */
                };
            });
            const personajes = document.querySelectorAll('#characters');
            [...personajes].map((ele) => {
                const li = ele.querySelectorAll('li');
                [...li].map((li) => {
                    dato.personajes.push({
                        nombre: li.querySelector('a').innerText
                    });
                });
            });
            const etiquetas = document.querySelectorAll('#tags');
            [...etiquetas].map((ele) => {
                const li = ele.querySelectorAll('li');
                [...li].map((li) => {
                    dato.etiquetas.push({
                        nombre: (li.querySelector('a').innerText).replace(/[^a-zA-Z0-9 ]/g, '').trim()
                    });
                });
            });
            const series = document.querySelectorAll('#series ul.comma-list');
            [...series].map((ele) => {
                const li = ele.querySelectorAll('li');
                [...li].map((li) => {
                    dato.series.push({
                        nombre: li.querySelector('a').innerText
                    });
                });
            });
            const fecha = document.querySelectorAll('span.date');
            [...fecha].map((ele) => {
                dato.fecha_scraping = ele.innerHTML;
            });
            const paginas = document.querySelectorAll('.thumbnail-list');
            [...paginas].map((ele) => {
                const li = ele.querySelectorAll('li');
                [...li].map((li, i) => {
                    const aux = li.querySelector('a');
                    dato.paginas.push({
                        url_scraping: baseUrl + (aux === null || aux === void 0 ? void 0 : aux.getAttribute('href')),
                        numero: i + 1,
                        url_big: '',
                        url_medio: '',
                        url_small: '',
                        data_scraping: '',
                        url_original: ''
                    });
                });
                dato.numero_pagina = [...li].length;
                console.log('cantidad paginas', [...li].length);
            });
            return dato;
        }, { dato, baseUrl });
        //await page.screenshot({ path: 'capturas/hitomi.png' })
        yield browser.close();
        //FOLDER CREATE
        const nombre = (0, moment_1.default)().format('YYMMDDHHmmss');
        obra.codigo = nombre;
        obra.fecha = (0, moment_1.default)(obra.fecha_scraping, 'D MMM YYYY, hh:mm').toDate();
        return obra;
    });
}
exports.scrapingObra = scrapingObra;
function scrapingPaginaImage(resultados, pathOriginal, pathSmall, pathMedio, pathBig) {
    return __awaiter(this, void 0, void 0, function* () {
        let paginas = [];
        for (const pagina of resultados.paginas) {
            const browserPagina = yield puppeteer_1.default.launch({
                headless: false,
                slowMo: 400
            });
            __1.logger.info(`Scrapeando informacion imagen ${pagina.url_scraping}`);
            const page = (yield browserPagina.pages())[0];
            const get = yield page.goto(pagina.url_scraping);
            const image = yield page.waitForSelector('img[src][class="lillie"]');
            const imgURL = yield image.evaluate(img => img.getAttribute('src'));
            const pageNew = yield browserPagina.newPage();
            const response = yield pageNew.goto(imgURL, { timeout: 0, waitUntil: 'networkidle0' });
            const imageBuffer = yield response.buffer();
            __1.logger.info(`IMAGEN ${imgURL}`);
            const formato = (0, conversiones_1.stringToFormat)(imgURL);
            __1.logger.info(`GUARDAR DATOS ${pathOriginal}/${pagina.numero}.${formato}`);
            yield fs.promises.writeFile(`${pathOriginal}/${pagina.numero}.${formato}`, imageBuffer);
            const pathStorageBig = yield OptimizarBig(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathBig);
            const pathStorageMedio = yield OptimizarMedio(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathMedio);
            const pathStorageSmall = yield OptimizarSmall(`${pathOriginal}/${pagina.numero}.${formato}`, `${pagina.numero}`, pathSmall);
            paginas.push(Object.assign(Object.assign({}, pagina), { url_big: pathStorageBig.replace(process.env.PATH_COMIC, ''), url_medio: pathStorageMedio.replace(process.env.PATH_COMIC, ''), url_small: pathStorageSmall.replace(process.env.PATH_COMIC, ''), url_original: `${pathOriginal.replace(process.env.PATH_COMIC, '')}/${pagina.numero}.${formato}`, data_scraping: imgURL }));
            yield page.close();
            yield browserPagina.close();
            break;
        }
        resultados.paginas = paginas;
        return resultados;
    });
}
exports.scrapingPaginaImage = scrapingPaginaImage;
function createFolder(codigo, pathOriginal, pathSmall, pathMedio, pathBig) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = `./comics`;
        if (!fs.existsSync(`${path}/${codigo}`)) {
            fs.mkdirSync(`${path}/${codigo}`);
            fs.mkdirSync(pathOriginal);
            fs.mkdirSync(pathSmall);
            fs.mkdirSync(pathMedio);
            fs.mkdirSync(pathBig);
        }
    });
}
exports.createFolder = createFolder;
function OptimizarBig(pathImagen, nameFile, pathBig) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.logger.info(`convirtiendo a avif Big desde ${pathImagen} a ${`${pathBig}/${nameFile}.avif`}`);
        const minifizar = yield (0, sharp_1.default)(pathImagen)
            .avif()
            .toFile(`${pathBig}/${nameFile}.avif`);
        return `${`${pathBig}/${nameFile}.avif`}`;
    });
}
exports.OptimizarBig = OptimizarBig;
function OptimizarMedio(pathImagen, nameFile, pathMedio) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.logger.info(`convirtiendo a avif Medio desde ${pathImagen} a ${`${pathMedio}/${nameFile}.avif`}`);
        const minifizar = yield (0, sharp_1.default)(pathImagen)
            .resize(250)
            .avif()
            .toFile(`${pathMedio}/${nameFile}.avif`);
        return `${pathMedio}/${nameFile}.avif`;
    });
}
exports.OptimizarMedio = OptimizarMedio;
function OptimizarSmall(pathImagen, nameFile, pathSmall) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.logger.info(`convirtiendo a avif Small desde ${pathImagen} a ${`${pathSmall}/${nameFile}.avif`}`);
        const minifizar = yield (0, sharp_1.default)(pathImagen)
            .resize(100)
            .avif()
            .toFile(`${pathSmall}/${nameFile}.avif`);
        return `${pathSmall}/${nameFile}.avif`;
    });
}
exports.OptimizarSmall = OptimizarSmall;
