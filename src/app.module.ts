import { Module } from '@nestjs/common';
import { SignatureModule } from './app/signature/signature.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true, 
  }),
  SignatureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
