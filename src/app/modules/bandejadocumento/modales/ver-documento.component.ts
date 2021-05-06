import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'bandeja-documento-modales-ver-documento',
  templateUrl: 'ver-documento.template.html'
})
export class VerDocumentoComponents implements OnInit {
  public onClose: Subject<boolean>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  idDocu:number;
  codigo: string;
  idRevision: string;
  loading: boolean;
  activar: boolean;
  consulta: boolean;
  //activartab : boolean;  
  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    /*Ocultar botones de todo el tab*/
    this.activar = false;
    this.consulta = false;
    /*Ocultar TAB revisiones*/
    //this.activartab = true;
  }

  ngOnInit() {
    
    this.codigo;
    localStorage.setItem("itemSeleccionado", this.codigo);
    localStorage.setItem("idRevisionSeleccionado", this.idRevision);
    this.loading = false;
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }
}
