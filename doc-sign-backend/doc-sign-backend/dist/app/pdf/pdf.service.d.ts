export declare class PdfService {
    private readonly pdfDir;
    private readonly decryptionKey;
    constructor();
    processPdf(file: Buffer): Promise<string>;
}
