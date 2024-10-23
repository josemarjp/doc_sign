import { Injectable } from '@nestjs/common';
import * as PDFLib from 'pdf-lib';
import { SignDto } from './dto/sign.dto';
import { v4 as uuidv4 } from 'uuid';
import { qpdf } from 'node-qpdf';
import * as dotenv from 'dotenv';

dotenv.config();
const password: string =  process.env.PDF_ENCRYPT_PASSWORD; 

@Injectable()
export class SignatureService {

    async signDocument(fileBuffer: Buffer, signDto: SignDto) {

        if (await PDFLib.PDFDocument.load(fileBuffer)){
            console.log('PDF NAO ESTA ENCRIPITADO!');
            const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
        } else {
            const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
            const decryptedPdf = (qpdf.decrypt(PDFLib.PDFDocument.load(fileBuffer), './', {
                password: password
            }));
        };

        const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        
        firstPage.drawText(`Assinado por: ${signDto.name}`, {
          x: 50,
          y: 50,
          size: 12,
        });

        const signedPdfBytes = await pdfDoc.save();

        //ENCRYPT OPTIONS

        const encryptedPdf = qpdf.encrypt(pdfDoc, signedPdfBytes, {
            password: password,
            keyLength: 256, // Opções: 128, 256
            restrictions: {
                print: 'low',
                modify: false,
                extract: false,
                annotate: false,
            },
        });
      
        const signatureId = uuidv4();
    
        return { id: signatureId, pdf: encryptedPdf };

    };
};
