import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PdfModule } from "./app/pdf/pdf.module";
import { SignatureModule } from "./app/signature/signature.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
      serveRoot: '/static', 
    }),
    SignatureModule,
    PdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
