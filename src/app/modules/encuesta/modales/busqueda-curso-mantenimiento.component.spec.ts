import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaColaboradorMantenimientoComponent } from './busqueda-curso-mantenimiento.component';

describe('BusquedaColaboradorMigracionComponent', () => {
  let component: BusquedaColaboradorMantenimientoComponent;
  let fixture: ComponentFixture<BusquedaColaboradorMantenimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaColaboradorMantenimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColaboradorMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
