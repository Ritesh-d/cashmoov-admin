import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import * as CryptoJS from 'crypto-js';



declare var require: any;

@Injectable()
export class EncryptData {

  masterKey: string;
  key: string;

  constructor(private configService: ConfigService) {
    this.masterKey = this.configService.masterKey;
  }

  encryptData(dataToEncrypt: string) {
    // console.log("masterKey : " + this.masterKey);
    // console.log("master key : " + window.atob(this.masterKey));
    var CryptoJS = require('crypto-js');
    var key = CryptoJS.enc.Utf8.parse(window.atob(this.masterKey));
    var encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
  }

  decryptData(dataToDecrypt: string) {
    // console.log("masterKey : " + this.masterKey);
    // console.log("master key : " + window.atob(this.masterKey));
    var CryptoJS = require('crypto-js');
    var key = CryptoJS.enc.Utf8.parse(window.atob(this.masterKey));
    var decrypted = CryptoJS.AES.decrypt(dataToDecrypt, key
      , {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    // console.log("decrypted : " + decrypted)
    // return decrypted.toString(CryptoJS.enc.Utf8);
    return CryptoJS.enc.Hex.stringify(decrypted.ciphertext);
  }

  set(value) {
    var key = CryptoJS.enc.Utf8.parse(this.masterKey);
    var iv = CryptoJS.enc.Utf8.parse(this.masterKey);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), this.masterKey,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value) {
    var key = CryptoJS.enc.Utf8.parse(this.masterKey);
    var iv = CryptoJS.enc.Utf8.parse(this.masterKey);
    var decrypted = CryptoJS.AES.decrypt(value, this.masterKey, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}