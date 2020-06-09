import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosUsuariosComponent } from './estados-usuarios.component';

describe('EstadosUsuariosComponent', () => {
  let component: EstadosUsuariosComponent;
  let fixture: ComponentFixture<EstadosUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
