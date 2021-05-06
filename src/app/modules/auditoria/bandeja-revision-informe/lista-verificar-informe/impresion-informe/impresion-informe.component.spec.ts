import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresionInformeComponent } from './impresion-informe.component';

describe('ImpresionInformeComponent', () => {
  let component: ImpresionInformeComponent;
  let fixture: ComponentFixture<ImpresionInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpresionInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpresionInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
