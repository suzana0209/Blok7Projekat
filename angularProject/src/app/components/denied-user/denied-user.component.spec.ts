import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedUserComponent } from './denied-user.component';

describe('DeniedUserComponent', () => {
  let component: DeniedUserComponent;
  let fixture: ComponentFixture<DeniedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeniedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeniedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
