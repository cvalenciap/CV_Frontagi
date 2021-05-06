import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'bandeja-documento-modales-revisiones',
  templateUrl: 'modal-revisiones.template.html'
})
export class ModalRevisiones implements OnInit {
  public onClose: Subject<boolean>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;

  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.loading = false;
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }
}
