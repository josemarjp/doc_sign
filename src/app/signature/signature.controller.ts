import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignatureService } from './signature.service';
import { SignDto } from './dto/sign.dto';

@Controller('api/v1/signature')
export class SignatureController {

    constructor(private readonly signatureService: SignatureService) {}

    @Post('sign')
    @UseInterceptors(FileInterceptor('file'))
    async signPdf(@UploadedFile() file: Express.Multer.File, @Body() signDto: SignDto) {
      const signedPdf = await this.signatureService.signDocument(file.buffer, signDto);
      return { signedPdf, signatureId: signedPdf.id };
    }

}
