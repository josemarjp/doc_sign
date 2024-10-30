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
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const fs = require("fs-extra");
const pdfParse = require("pdf-parse");
const qpdf = require("node-qpdf");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
let PdfService = class PdfService {
    constructor() {
        this.pdfDir = './pdfs';
        this.decryptionKey = process.env.PDF_DECRYPTION_KEY || '';
        fs.ensureDirSync(this.pdfDir);
    }
    async processPdf(file) {
        try {
            await pdfParse(file);
        }
        catch (error) {
            const tempPath = path.join(this.pdfDir, 'temp.pdf');
            const decryptedPath = path.join(this.pdfDir, 'decrypted_temp.pdf');
            (0, fs_1.writeFileSync)(tempPath, file);
            await qpdf.decrypt(tempPath, decryptedPath, { key: this.decryptionKey });
            file = fs.readFileSync(decryptedPath);
            fs.unlinkSync(tempPath);
            fs.unlinkSync(decryptedPath);
        }
        const id = (0, uuid_1.v4)();
        const pdfPath = path.join(this.pdfDir, `${id}.pdf`);
        (0, fs_1.writeFileSync)(pdfPath, file);
        return id;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PdfService);
//# sourceMappingURL=pdf.service.js.map