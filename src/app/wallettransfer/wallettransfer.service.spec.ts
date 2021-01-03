import { TestBed } from '@angular/core/testing';

import { WallettransferService } from './wallettransfer.service';

describe('WallettransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WallettransferService = TestBed.get(WallettransferService);
    expect(service).toBeTruthy();
  });
});
