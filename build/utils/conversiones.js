"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToFormat = exports.convertJson = exports.toBase64 = void 0;
const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
exports.toBase64 = toBase64;
const convertJson = (message) => {
    return JSON.stringify(message, null, "\t");
};
exports.convertJson = convertJson;
function stringToFormat(str) {
    const array = str.split('.');
    const ultimoCaracter = array[array.length - 1];
    return ultimoCaracter;
}
exports.stringToFormat = stringToFormat;
