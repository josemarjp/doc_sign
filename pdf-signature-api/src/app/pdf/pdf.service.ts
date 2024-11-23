import { Injectable } from '@nestjs/common';
import { SignPdfDto } from './dto/sign-pdf.dto';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PdfService {
  async signPdf(signPdfDto: SignPdfDto): Promise<Buffer> {
    const { filename, name, email, position } = signPdfDto;
    const pdfPath = join(process.cwd(), 'uploads', filename);
    
    // Lê o PDF original
    const pdfBytes = await fs.promises.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Obtém a primeira página
    const page = pdfDoc.getPages()[0];
    
    // Adiciona a fonte
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Adiciona a assinatura
    page.drawText(`Assinado por: ${name}`, {
      x: position.x,
      y: page.getHeight() - position.y,
      font,
      size: 12,
    });
    
    page.drawText(`Email: ${email}`, {
      x: position.x,
      y: page.getHeight() - position.y - 15,
      font,
      size: 12,
    });
    
    // Salva o PDF
    const signedPdfBytes = await pdfDoc.save();
    
    return Buffer.from(signedPdfBytes);
  }
}