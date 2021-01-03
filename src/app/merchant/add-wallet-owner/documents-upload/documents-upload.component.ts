import { Component, OnInit, Inject } from '@angular/core';
import { DocumentsUploadService } from './documents-upload.service';
import { HttpEventType } from '@angular/common/http';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.css']
})
export class DocumentsUploadComponent implements OnInit {

  getcurrentLang:any;
  filesNInfo: any[];
  successMessage: string;
  errorMessage: string;
  kycDocuments: any[];
  documentsForm: FormGroup;
  documentsTypes: any[];
  docInfo: string;
  constructor(private documentsUploadService: DocumentsUploadService,private translate : TranslatelanguageService,
    private addWalletOwnerService: AddWalletOwnerService,
    @Inject(DOCUMENT) document) {

      this.getcurrentLang=this.translate.getcurrentLang();
     }

  ngOnInit() {
    this.filesNInfo = [];
    this.docInfo = this.documentsUploadService.prepareDocNote;
    this.documentsUploadService.documentsTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.documentsUploadService.documentTypeResponse = data;
       
        this.documentsTypes = [{ code: '', type: 'select document' }, ...data.documentTypeList];
        this.documentsForm = this.documentsUploadService.createDocumentsFormGroup();
        if ((this.documentsForm.get('documents') as FormArray).length === 0) {
          this.onAddDocument();
        }
      } else {
        this.errorMessage = data.resultDescription;
      }
    });
  }

  onFileSelected(fileInput: any, index: number) {
    this.filesNInfo[index].fileSelected = true;
    this.filesNInfo[index].file = fileInput.target.files[0];
    this.filesNInfo[index].fileName = fileInput.target.files[0].name;
    const validFile = this.documentsUploadService.validFile(fileInput.target.files[0]);
    if(! validFile.valid){
      this.errorMessage = validFile.message;
      this.disappearErrorMessage();
    };
  }

  docHandler(event: any, index: number) {
    this.filesNInfo[index].docType = event.target.value;
  }

  onAddDocument() {
    (this.documentsForm.get('documents') as FormArray).push(new FormGroup({
      documentType: new FormControl(''),
      file: new FormControl('')
    }));
    this.filesNInfo.push({
      fileSelected: false,
      docType: undefined,
      file: undefined,
      fileName: 'choose file',
      uploadstart: false,
      uploaded: 0
    });
  }

  onRemoveDocument(index: number) {
    (this.documentsForm.get('documents') as FormArray).removeAt(index);
    this.filesNInfo.splice(index, 1);
  }

  get getDocumentsControl() {
    return (this.documentsForm.get('documents') as FormArray).controls;
  }

  showUpload(index: number): boolean {
    if (this.filesNInfo[index].docType && this.filesNInfo[index].fileSelected) {
      return this.documentsUploadService.validFile(this.filesNInfo[index].file).valid;
    } else {
      // file / type not selected
      return false;
    }
  }

  onUpload(index: number) {
    if (this.addWalletOwnerService.walletOwnerId) {
      this.filesNInfo[index].uploadstart = true;
      console.log('--filesNInfo--', this.filesNInfo);
      const details = {
        fileName: this.filesNInfo[index].fileName,
        docTypeCode: this.filesNInfo[index].docType,
        walletOwnerCode: this.addWalletOwnerService.walletOwnerId
      };

      this.documentsUploadService.fileUpload(this.filesNInfo[index].file, details).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.filesNInfo[index].uploaded = Math.round(event.loaded / event.total) * 100;
        } else if (event.type === HttpEventType.Response) {
          if (event.body && event.body.resultCode === '0') {
            this.filesNInfo[index].uploaded = 100;
            this.errorMessage = undefined;
          } else {
            this.successMessage = undefined;
            this.errorMessage = event.body.resultDescription;
            this.disappearErrorMessage();
          }
        }
      }, error => {
        console.log('--error--', error);
        this.successMessage = undefined;
        this.errorMessage = error.message;
        this.disappearErrorMessage();
      });
    } else {
      //this.errorMessage = 'Create Wallet-owner first';
      this.translate.languageText('MERCHANT.createWallet-ownerfirst', data=> {
        this.errorMessage=data;
      });
      
      this.disappearErrorMessage();
    }

  }

  disappearErrorMessage() {
    setTimeout(() => {
      this.errorMessage = undefined;
    }, 5000);
  }

}
