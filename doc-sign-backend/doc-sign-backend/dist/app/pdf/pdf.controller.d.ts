import { PdfService } from './pdf.service';
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    uploadPdf(file: Express.Multer.File): Promise<{
        uuid: string;
    }>;
    prepareSignature(body: {
        pdfId: string;
        name: string;
        email: string;
    }): Promise<{
        renderUrl: string;
    }>;
}
