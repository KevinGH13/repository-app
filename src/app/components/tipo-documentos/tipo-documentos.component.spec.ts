import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentosComponent } from './tipo-documentos.component';

describe('TipoDocumentosComponent', () => {
  let component: TipoDocumentosComponent;
  let fixture: ComponentFixture<TipoDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
