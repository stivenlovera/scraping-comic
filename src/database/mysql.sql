DROP DATABASE IF EXISTS scraping_web;
CREATE DATABASE scraping_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS webscraping;
CREATE TABLE webscraping
(
    webscraping_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fechaCreacion datetime DEFAULT now()
);

INSERT INTO webscraping (fechaCreacion) VALUES (now());

DROP TABLE IF EXISTS pagina;
CREATE TABLE pagina
(
    pagina_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT NOT NULL,
    href TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    cantidad INT(11) NOT NULL,
    fechaCreacion datetime
);

DROP TABLE IF EXISTS dato;
CREATE TABLE dato
(
    dato_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT NOT NULL,
    completed INT(11) NOT NULL,
    href TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    cantidad INT(11) NOT NULL,
    cantidad_obras INT(11) NOT NULL,
    pagina_id INT(11) NOT NULL
);


DROP TABLE IF EXISTS libro;
CREATE TABLE libro
(
    libro_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    completed INT(11) NOT NULL,
    href TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    dato_id INT(11) NOT NULL
);

SELECT * FROM webscraping;
SELECT * FROM pagina;
SELECT * FROM dato;
SELECT * FROM libro;

SELECT * FROM dato INNER JOIN pagina ON dato.pagina_id=pagina.pagina_id WHERE dato.pagina_id=2;

SELECT libro_id FROM libro INNER JOIN dato ON dato.dato_id=libro.dato_id WHERE dato.pagina_id=2;

DELETE FROM libro WHERE libro.libro_id in ()

 INSERT INTO libro(completed,
href,
dato_id) VALUES('1','https://hitomi.la/imageset/ナエナエ�🐰--58316460--2024.11.30日本語語-3141736.html','1');
