import { SignDto } from './dto/sign.dto';
export declare class SignatureService {
    signDocument(fileBuffer: Buffer, signDto: SignDto): Promise<{
        id: any;
        pdf: any;
    }>;
}
