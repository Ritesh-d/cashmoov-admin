import { TestBed } from '@angular/core/testing';

import { TransactionreversalService } from './transactionreversal.service';

describe('TransactionreversalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionreversalService = TestBed.get(TransactionreversalService);
    expect(service).toBeTruthy();
  });
});
