export declare class PdfService {
    private readonly pdfDir;
    private readonly decryptionKey;
    private readonly renderUrlBase;
    constructor();
    processPdf(file: Buffer): Promise<string>;
    preparePdfForSigning(pdfId: string, name: string, email: string): Promise<string>;
}
