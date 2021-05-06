import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoRelacionadoSolicitudCancelacionComponent } from './documento-relacionado-solicitud-cancelacion.component';

describe('DocumentoRelacionadoSolicitudCancelacionComponent', () => {
  let component: DocumentoRelacionadoSolicitudCancelacionComponent;
  let fixture: ComponentFixture<DocumentoRelacionadoSolicitudCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoRelacionadoSolicitudCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoRelacionadoSolicitudCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
