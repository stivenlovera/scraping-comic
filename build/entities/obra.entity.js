"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obra = void 0;
const typeorm_1 = require("typeorm");
const serie_entity_1 = require("./serie.entity");
const pagina_entity_1 = require("./pagina.entity");
const personaje_entity_1 = require("./personaje.entity");
const lenguaje_entity_1 = require("./lenguaje.entity");
const grupo_entity_1 = require("./grupo.entity");
const tipo_entity_1 = require("./tipo.entity");
const etiqueta_entity_1 = require("./etiqueta.entity");
const artista_entity_1 = require("./artista.entity");
let Obra = class Obra {
};
exports.Obra = Obra;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Obra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Obra.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Obra.prototype, "numero_pagina", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Obra.prototype, "fecha_scraping", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Obra.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => tipo_entity_1.Tipo),
    __metadata("design:type", tipo_entity_1.Tipo)
], Obra.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => grupo_entity_1.Grupo),
    __metadata("design:type", grupo_entity_1.Grupo)
], Obra.prototype, "grupo", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => lenguaje_entity_1.Lenguaje),
    __metadata("design:type", lenguaje_entity_1.Lenguaje)
], Obra.prototype, "lenguaje", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Obra.prototype, "url_scraping", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => artista_entity_1.Artista),
    __metadata("design:type", Array)
], Obra.prototype, "artistas", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => personaje_entity_1.Personaje),
    __metadata("design:type", Array)
], Obra.prototype, "personajes", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => serie_entity_1.Serie),
    __metadata("design:type", Array)
], Obra.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => pagina_entity_1.Pagina),
    __metadata("design:type", Array)
], Obra.prototype, "paginas", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => etiqueta_entity_1.Etiqueta),
    __metadata("design:type", Array)
], Obra.prototype, "etiquetas", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Obra.prototype, "codigo", void 0);
exports.Obra = Obra = __decorate([
    (0, typeorm_1.Entity)({ name: 'obra' })
], Obra);
