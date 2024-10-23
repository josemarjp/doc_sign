"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureService = void 0;
const common_1 = require("@nestjs/common");
const PDFLib = require("pdf-lib");
const uuid_1 = require("uuid");
const node_qpdf_1 = require("node-qpdf");
const dotenv = require("dotenv");
dotenv.config();
const password = process.env.PDF_ENCRYPT_PASSWORD;
let SignatureService = class SignatureService {
    async signDocument(fileBuffer, signDto) {
        if (await PDFLib.PDFDocument.load(fileBuffer)) {
            console.log('PDF NAO ESTA ENCRIPITADO!');
            const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
        }
        else {
            const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
            const decryptedPdf = (node_qpdf_1.qpdf.decrypt(PDFLib.PDFDocument.load(fileBuffer), './', {
                password: password
            }));
        }
        ;
        const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        firstPage.drawText(`Assinado por: ${signDto.name}`, {
            x: 50,
            y: 50,
            size: 12,
        });
        const signedPdfBytes = await pdfDoc.save();
        const encryptedPdf = node_qpdf_1.qpdf.encrypt(pdfDoc, signedPdfBytes, {
            password: password,
            keyLength: 256,
            restrictions: {
                print: 'low',
                modify: false,
                extract: false,
                annotate: false,
            },
        });
        const signatureId = (0, uuid_1.v4)();
        return { id: signatureId, pdf: encryptedPdf };
    }
    ;
};
exports.SignatureService = SignatureService;
exports.SignatureService = SignatureService = __decorate([
    (0, common_1.Injectable)()
], SignatureService);
;
//# sourceMappingURL=signature.service.js.map