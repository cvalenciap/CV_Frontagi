import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionSolicitudCancelacionComponent } from './informacion-solicitud-cancelacion.component';

describe('InformacionSolicitudCancelacionComponent', () => {
  let component: InformacionSolicitudCancelacionComponent;
  let fixture: ComponentFixture<InformacionSolicitudCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionSolicitudCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionSolicitudCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
