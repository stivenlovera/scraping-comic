"use strict";
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
exports.scrapingPerArtista = void 0;
console.log('web scraping https://hitomi.la/allartists-123.html ');
const puppeteer_1 = __importDefault(require("puppeteer"));
require("dotenv/config");
const __1 = require("..");
function scrapingPerArtista(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = process.env.URL_SCRAPING;
        const browser = yield puppeteer_1.default.launch({
            headless: false,
            slowMo: 400
        });
        __1.logger.info(`Scrapeando ${baseUrl + url}`);
        const page = yield browser.newPage();
        yield page.goto(baseUrl + url);
        const artistas = [];
        const resultados = yield page.evaluate(({ baseUrl, artistas }) => {
            const contenido = document.querySelectorAll('.posts');
            const datos = [...contenido].map((ul) => {
                const li = ul.querySelectorAll('li');
                const etiquetas = [...li].map((etiqueta, i) => {
                    var _a, _b;
                    const rango = etiqueta.innerText.trim().split(' ');
                    const nuevaCadena = rango[rango.length - 1];
                    artistas.push({
                        nombre: (_a = etiqueta.querySelector('a')) === null || _a === void 0 ? void 0 : _a.innerText,
                        href: `${baseUrl}${(_b = etiqueta.querySelector('a')) === null || _b === void 0 ? void 0 : _b.getAttribute('href')}`,
                        cantidad: parseInt(nuevaCadena.replace('(', '').replace(')', ''))
                    });
                });
                return etiquetas;
            });
            return artistas;
        }, { baseUrl, artistas });
        //await page.screenshot({ path: 'capturas/hitomi.png' })
        yield browser.close();
        return resultados;
    });
}
exports.scrapingPerArtista = scrapingPerArtista;
function filtroArray(array) {
    let resultado = [];
    let total = 0;
    array.map((e) => {
        e.map((a) => {
            console.log(a);
            total = total + a.cantidad;
            resultado.push(a);
        });
    });
    console.log('total: ', total);
    return resultado;
}
