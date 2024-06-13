export const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const convertJson = (message: any):string => {
    return JSON.stringify(message, null, "\t");
}

export function stringToFormat(str:string) {
    const array=str.split('.');
    const ultimoCaracter=array[array.length-1];
    return ultimoCaracter;
}