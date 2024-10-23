import { SignatureService } from './signature.service';
import { SignDto } from './dto/sign.dto';
export declare class SignatureController {
    private readonly signatureService;
    constructor(signatureService: SignatureService);
    signPdf(file: Express.Multer.File, signDto: SignDto): Promise<{
        signedPdf: {
            id: any;
            pdf: any;
        };
        signatureId: any;
    }>;
}
