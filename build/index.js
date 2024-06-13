"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logguers_1 = require("./config/logguers");
const run_artista_1 = require("./run/run-artista");
exports.logger = (0, logguers_1.InitializeLoggers)();
exports.logger.info(`Inicializando Scraping...`);
try {
    (0, run_artista_1.inizialize)();
    //console.log(moment("7 feb 2017, 8:06 p.m.",'D MMM YYYY, hh:mm a').format('YYYY-MM-DD hh:mm:ss a'));
}
catch (error) {
    exports.logger.warn(`Error generado`);
}
//initializePage()
