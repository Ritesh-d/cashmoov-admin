import { Injectable} from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

@Injectable()
export class CustomMissingTranslationHandler implements MissingTranslationHandler  {

    handle() {       
    }

}