import { Injectable } from '@nestjs/common';
const crypto = require('crypto');
var EC = require('elliptic').ec;
var ec = new EC('curve25519');
const bs58 = require('bs58');

const privateKeyHex = '09c3fc71e020302b9b264276ab96c881a1455692b7520509f7281c5efcf9e51c';
const publicKeyHex = '04428ddfc6a0e009b6347af707dd378aec4a90ef4605c816529178c25835efd7cd5c0aeafca4cc49fc724b599ef6081bc46ddbd9e1ca7ac931a48ed21594f01065';
const ivStr = "4e5Wa71fYoT7MFEX";

@Injectable()
export class AppService {

  getHello(): string {
    return '<b>Hello World!</b>';
  }

  encryptData(): any {
    let plaintext = '{"target":"TELMA","version":"V2.95","channel":"VOILADOC"}';
    // let plaintext = "Test1";
    // Convert the key to a Buffer object.
    // Generate keys
    var aServiceKey = ec.keyPair({ pub: publicKeyHex, pubEnc: 'hex' });
    const aServicePublicKey = aServiceKey.getPublic();
    var bServiceKey = ec.keyPair({ priv: privateKeyHex, privEnc: 'hex' });
    var sharedKey1 = aServicePublicKey.mul(bServiceKey.getPrivate());

    console.log('sharedKey1.toString(16):', sharedKey1.getX().toString(16));
    // console.log('shared2.toString(16):', shared2.getX().toString(16));
    const sharedKey1Data = sharedKey1.getX().toString(16);
    const ivBuffer = Buffer.from(ivStr);; // crypto.randomBytes(16); // Initialization vector.
    var encryptionKeySha256 = crypto.createHash("sha256").update(sharedKey1Data).digest();
    var cipher = crypto.createCipheriv("aes-256-cbc", encryptionKeySha256, ivBuffer);
    console.log("plaintext: ", plaintext);
    // console.log("Buffer.from(plaintext): ", Buffer.from(plaintext));
    var buffers = [cipher.update(Buffer.from(plaintext))];
    console.log("buffers : ", buffers);
    buffers.push(cipher.final());
    var bufferB = Buffer.concat(buffers);
    console.log("bufferB: ", bufferB);

    var encrypted = bs58.encode(bufferB);
    console.log("base58Str: ", encrypted);
    return "VLD1" + encrypted;
  }

  decryptData(): any {
    var encryptedext = "AptctrscsoHPS1aTPEyMxi";
    // Convert the key to a Buffer object.
    // Generate keys
    var aServiceKey = ec.keyPair({ pub: publicKeyHex, pubEnc: 'hex' });
    const aServicePublicKey = aServiceKey.getPublic();
    var bServiceKey = ec.keyPair({ priv: privateKeyHex, privEnc: 'hex' });
    var sharedKey1 = aServicePublicKey.mul(bServiceKey.getPrivate());

    console.log('sharedKey1.toString(16):', sharedKey1.getX().toString(16));
    // console.log('shared2.toString(16):', shared2.getX().toString(16));

    const ivBuffer = Buffer.from(ivStr); //crypto.randomBytes(16); // Initialization vector.
    var encryptionKeySha256 = crypto.createHash("sha256").update(sharedKey1.getX().toString(16)).digest();
    var cipher = crypto.createDecipheriv("aes-256-cbc", encryptionKeySha256, ivBuffer);
    const decoded = bs58.decode(encryptedext);
    const buff = Buffer.from(decoded);
    console.log("buff: ", buff.toString('utf8'));
    var buffers = [cipher.update(buff)];
    console.log("buffers: ", buffers);
    buffers.push(cipher.final());
    var decrypted = Buffer.concat(buffers);
    console.log("decrypted: ", decrypted.toString('utf8'));
    return decrypted.toString('utf8');
  }

}
