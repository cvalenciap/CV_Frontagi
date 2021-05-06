import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaColaboradorMigracionComponent } from './busqueda-colaborador-migracion.component';

describe('BusquedaColaboradorMigracionComponent', () => {
  let component: BusquedaColaboradorMigracionComponent;
  let fixture: ComponentFixture<BusquedaColaboradorMigracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaColaboradorMigracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColaboradorMigracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
