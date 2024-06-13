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
exports.PageArtista = void 0;
const typeorm_1 = require("typeorm");
const artista_entity_1 = require("./artista.entity");
let PageArtista = class PageArtista {
};
exports.PageArtista = PageArtista;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], PageArtista.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PageArtista.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PageArtista.prototype, "href", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PageArtista.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => artista_entity_1.Artista),
    __metadata("design:type", Array)
], PageArtista.prototype, "artistas", void 0);
exports.PageArtista = PageArtista = __decorate([
    (0, typeorm_1.Entity)()
], PageArtista);
