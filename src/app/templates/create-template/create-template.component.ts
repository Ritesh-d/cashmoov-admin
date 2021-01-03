import { Component, OnInit } from '@angular/core';
import { CreateTemplateService } from './create-template.service';
import { TemplatesConstants } from '../templates.constants';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

  templateCategoryCode: number;
  selectedTemplateCategory: string;
  createdTemplateName: string;
  createdTemplateCode: string;
  serviceProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.SERVICE_PROFILE;
  subscriptionProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.SUBSCRIPTION_PROFILE
  feeCommssionTemplateCategoryCode= TemplatesConstants.identifiers.templateCategoryCodes.FEE_COMMISION;
  limitsRestrictionProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.LIMITS_RESTRICTION_PROFILE;
  creditLimitTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.CREDIT_LIMIT;
  overdraftProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.OVERDRAFT_PROFILE;
  promotionProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.PROMOTION_PROFILE;
  loyaltyProfileTemplateCategoryCode = TemplatesConstants.identifiers.templateCategoryCodes.LOYALTY_PROFILE;
  constructor(private createTemplateService: CreateTemplateService) { }

  ngOnInit() {
    this.templateCategoryCode = +this.createTemplateService.templateCategoryId;
    this.selectedTemplateCategory = this.createTemplateService.templateCategory;
    this.createdTemplateName = this.createTemplateService.templateName;
    this.createdTemplateCode = this.createTemplateService.newlyCreatedTemplateCode;

  }

}
