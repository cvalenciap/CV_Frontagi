import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustentoSolicitudCancelacionComponent } from './sustento-solicitud-cancelacion.component';

describe('SustentoSolicitudCancelacionComponent', () => {
  let component: SustentoSolicitudCancelacionComponent;
  let fixture: ComponentFixture<SustentoSolicitudCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustentoSolicitudCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustentoSolicitudCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
