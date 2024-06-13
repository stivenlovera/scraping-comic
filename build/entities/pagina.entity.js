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
exports.Pagina = void 0;
const typeorm_1 = require("typeorm");
let Pagina = class Pagina {
};
exports.Pagina = Pagina;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Pagina.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pagina.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "url_original", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "url_small", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "url_medio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "url_big", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "url_scraping", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pagina.prototype, "data_scraping", void 0);
exports.Pagina = Pagina = __decorate([
    (0, typeorm_1.Entity)({ name: 'pagina' })
], Pagina);
