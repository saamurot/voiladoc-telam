import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ec as EC } from 'elliptic';
import bs58 from 'bs58';
import * as crypto from 'crypto';

// const ec = new elliptic.ec('secp256k1');
const ec = new EC('curve25519');

const iv = Buffer.from('4e5Wa71fYoT7MFEX', 'hex');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/encrypt')
  encrypt(): any {
    return this.appService.encryptData();
  }


  @Get('/decrypt')
  decrypt(): any {
    return this.appService.decryptData();
  }

}