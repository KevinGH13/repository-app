import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosGeneralesComponent } from './parametros-generales.component';

describe('ParametrosGeneralesComponent', () => {
  let component: ParametrosGeneralesComponent;
  let fixture: ComponentFixture<ParametrosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
