import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-busqueda-seguimiento-documento',
  templateUrl: './modal-busqueda-seguimiento-documento.component.html',
  styleUrls: ['./modal-busqueda-seguimiento-documento.component.scss']
})
export class ModalBusquedaSeguimientoDocumentoComponent implements OnInit {

  public codigoDocumento:string = '';
  public tituloDocumento:string = '';
  public interruptorBotones: boolean;
  public parametros: Map<string, any>;
  public onClose: Subject<Map<string, any>>;

  constructor(public bsModalRef: BsModalRef) { 
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.parametros = new Map<string, any>();
    this.interruptorBotones = true;
  }

  validarInterruptorBotones() {
    if (this.codigoDocumento !== ''  || this.tituloDocumento !== '') {
      this.interruptorBotones = false;
    } else {
      this.interruptorBotones = true;
    }
  }

  enviarParametros() {
    if (this.codigoDocumento.trim() !== '') { this.parametros.set('codigo', this.codigoDocumento); }
    if (this.tituloDocumento.trim() !== '') { this.parametros.set('descripcion', this.tituloDocumento);}

    this.onClose.next(this.parametros);
    this.bsModalRef.hide();
  }

  cancelar(){
    this.bsModalRef.hide();
  }


}
