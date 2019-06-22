import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvlComponent } from './cvl.component';

describe('CvlComponent', () => {
  let component: CvlComponent;
  let fixture: ComponentFixture<CvlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
