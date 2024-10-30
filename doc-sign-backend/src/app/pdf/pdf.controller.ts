import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from './pdf.service';

@Controller('api/v1/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File): Promise<{ uuid: string }> {
    if (!file) {
      throw new Error('Arquivo PDF não encontrado');
    }

    const uuid = await this.pdfService.processPdf(file.buffer);
    return { uuid };
  }
}
