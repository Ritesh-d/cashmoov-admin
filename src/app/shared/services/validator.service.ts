import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ComboBoxValidatorService{
    constructor(){}

    comboValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.value !== undefined && control.value == -1) {
            return { 'comboValidator': true };
        }
        return null;
    }
        
}

