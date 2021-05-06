import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { Paginacion } from '../../../models/paginacion';

@Component({
  selector: 'fase-registro',
  templateUrl: 'fase-registro.template.html'
})
export class FaseRegistroComponent implements OnInit {

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  paginacion: Paginacion;

  constructor() {
    this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {
    this.loading = false;
  }
}
