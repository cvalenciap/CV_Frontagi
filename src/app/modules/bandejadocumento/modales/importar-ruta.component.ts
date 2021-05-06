import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'bandeja-documento-modales-importar-ruta',
  templateUrl: 'importar-ruta.template.html'
})
export class ImportarRutaComponents implements OnInit {
  public onClose: Subject<boolean>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  activar: boolean;
  consulta: boolean;

  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    this.activar = false;
    this.consulta = false;
  }

  ngOnInit() {
    this.loading = false;
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }
}
