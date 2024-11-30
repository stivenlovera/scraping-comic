DROP DATABASE IF EXISTS scraping_web;


CREATE DATABASE scraping_web;


CREATE TABLE pagina
(
    pagina_id INT NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    href TEXT NOT NULL,
    fechaCreacion datetime
)

CREATE TABLE artista
(
    artista_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT NOT NULL,
    completed INT(11) NOT NULL,
    href TEXT NOT NULL,
    cantidad INT(11) NOT NULL,
    cantidad_obras INT(11) NOT NULL,
    pagina_id INT(11) NOT NULL
)