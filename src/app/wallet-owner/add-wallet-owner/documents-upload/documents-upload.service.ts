import { Injectable } from '@angular/core';
import { Endpoints } from '../../../shared/endpoints';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { CommonHelperService } from '../../../shared/services/common-helper-service';

@Injectable()
export class DocumentsUploadService {

  documentTypeResponse: any;
  allowedFileType = [];
  fileSize: number;
  constructor(private endpoints: Endpoints,
    private http: HttpClient,
    private addWalletOwnerService: AddWalletOwnerService,
    private commonHelpeService: CommonHelperService) { }

  public createDocumentsFormGroup(): FormGroup {
    return new FormGroup({
      documents: new FormArray([])
    });
  }

  get allowedTypes() {
    return this.commonHelpeService.configData['allowedDocumentType'];
  }
  get allowedFileSize() {
    return this.commonHelpeService.configData['allowedFileSize'];
  }
  
  get prepareDocNote(): string {
    this.allowedFileType = this.allowedTypes;
    this.fileSize = +this.allowedFileSize;
    let docInfo = '* allowed format are as: '
    this.allowedFileType.forEach(item => {
      docInfo = docInfo + item+ ',';
    });
    docInfo = docInfo + ' maximum file size allowed ' + (this.fileSize/1000) + ' kb' ;
    return docInfo;
  }

  public get documentsTypes(): Observable<any> {
    if (this.documentTypeResponse && this.documentTypeResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.documentTypeResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.DOCUMENT_TYPE);
  }

  fileUpload(file: File, details?: any): Observable<any> {
    const formData = new FormData;
    formData.append('file', file);
    formData.append('docTypeCode', details.docTypeCode);
    formData.append('walletOwnerCode', details.walletOwnerCode);
    return this.http.post(this.endpoints.E_WALLET_FILE_UPLOAD_URL, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  getDocumentsOfWalletOwner(walletOwnerCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_FILE_UPLOAD_URL + '/walletOwner/' + walletOwnerCode)
  }

  validFile(file: File): { valid: boolean, message: string } {
    if (file.size > this.fileSize) {
      return { valid: false, message: 'File size exceeds' };
    } else if (!this.allowedFileType.includes(file.type)) {
      return { valid: false, message: 'Invalid file extension' };
    } else {
      return { valid: true, message: undefined };
    }
  }
}
