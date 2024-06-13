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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeLoggers = void 0;
const winston_1 = __importStar(require("winston"));
require("winston-daily-rotate-file");
const { combine, timestamp, label, printf } = winston_1.format;
function InitializeLoggers() {
    var transport = new winston_1.default.transports.DailyRotateFile({
        dirname: 'logs/' + getDirName(),
        filename: 'log-%DATE%',
        datePattern: 'YYYY-MM-DD', // rotates every day
    });
    /*  transport.on('rotate', function () {
         if (!fs.existsSync('logs/' + getDirName() + '/')) {
             transport = new winston.transports.DailyRotateFile({
                 dirname: 'logs/' + getDirName(),
                 filename: 'log-%DATE%' + '.log',
                 datePattern: 'YYYY-MM-DD',
 
             });
         }
     }); */
    function getDirName() {
        var curDate = new Date();
        var curMonth = ("0" + (curDate.getMonth() + 1)).slice(-2);
        var curYYYYMM = curDate.getFullYear() + "-" + curMonth;
        return curYYYYMM;
    }
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
    });
    var logger = winston_1.default.createLogger({
        format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
        transports: [
            transport,
            new (winston_1.default.transports.Console)({ level: 'info' }),
        ]
    });
    return logger;
}
exports.InitializeLoggers = InitializeLoggers;
// Initialize the transport with the proper folder for the current month.
