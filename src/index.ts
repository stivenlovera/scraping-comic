
import moment from "moment";
import { InitializeLoggers } from "./config/logguers";
import { inizialize } from "./run/run-artista";
import { init, initializePage } from "./run/run-artistas";

export const logger = InitializeLoggers();

logger.info(`Inicializando Scraping...`)
try {
    inizialize();
    //console.log(moment("7 feb 2017, 8:06 p.m.",'D MMM YYYY, hh:mm a').format('YYYY-MM-DD hh:mm:ss a'));
} catch (error) {
    logger.warn(`Error generado`)
}

//initializePage()
