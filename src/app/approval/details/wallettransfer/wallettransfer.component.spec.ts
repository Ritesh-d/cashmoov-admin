import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallettransferComponent } from './wallettransfer.component';

describe('WallettransferComponent', () => {
  let component: WallettransferComponent;
  let fixture: ComponentFixture<WallettransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallettransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallettransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
