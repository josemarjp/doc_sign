import { PdfService } from './pdf.service';
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    uploadPdf(file: Express.Multer.File): Promise<{
        uuid: string;
    }>;
}
