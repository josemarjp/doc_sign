import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync } from 'fs';
import * as fs from 'fs-extra';
import * as pdfParse from 'pdf-parse';
import * as qpdf from 'node-qpdf';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PdfService {
  private readonly pdfDir = './pdfs';
  private readonly decryptionKey = process.env.PDF_DECRYPTION_KEY || '';

  constructor() {
    // VALIDA SE O DIRETIORIO EXISTE
    fs.ensureDirSync(this.pdfDir);
  }

  async processPdf(file: Buffer): Promise<string> {
    try {
      await pdfParse(file);
    } catch (error) {
      const tempPath = path.join(this.pdfDir, 'temp.pdf');
      const decryptedPath = path.join(this.pdfDir, 'decrypted_temp.pdf');

      writeFileSync(tempPath, file);

      await qpdf.decrypt(tempPath, decryptedPath, { key: this.decryptionKey });

      file = fs.readFileSync(decryptedPath);

      fs.unlinkSync(tempPath);
      fs.unlinkSync(decryptedPath);
    }

    const id = uuidv4();
    const pdfPath = path.join(this.pdfDir, `${id}.pdf`);

    writeFileSync(pdfPath, file);

    return id;
  }
}